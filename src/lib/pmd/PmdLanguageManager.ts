import {Config} from '../util/Config';
import {Controller} from '../../Controller';
import {LANGUAGE} from '../../Constants'
import {Logger, SfdxError, Messages} from '@salesforce/core';
import {AsyncCreatable} from '@salesforce/kit';
import { ENGINE } from '../../Constants';
import {uxEvents} from '../ScannerEvents';

Messages.importMessagesDirectory(__dirname);
const eventMessages = Messages.loadMessages("@salesforce/sfdx-scanner", "EventKeyTemplates");

const VALID_LANGUAGES_BY_ALIAS: Map<string, string> = new Map([
	['apex', 'apex'],
	['java', 'java'],
	['javascript', 'javascript'],
	['ecmascript', 'javascript'],
	['js', 'javascript'],
	['jsp', 'jsp'],
	['modelica', 'modelica'],
	['plsql', 'plsql'],
	['pl/sql', 'plsql'],
	['pl-sql', 'plsql'],
	['scala', 'scala'],
	['vf', 'visualforce'],
	['visualforce', 'visualforce'],
	['xml', 'xml'],
	['pom', 'xml'],
	['xsl', 'xml']
]);

// This is a subset of the languages in VALID_LANGUAGES_BY_ALIAS. It exists so we can telegraph our intention to end PMD
// support for all languages except for these.
const SUPPORTED_LANGUAGES: Set<string> = new Set([
	'apex',
	'java',
	'javascript',
	'visualforce',
	'xml'
]);

let INSTANCE: PmdLanguageManager = null;

class PmdLanguageManager extends AsyncCreatable {
	private logger: Logger;
	private config: Config;
	private initialized: boolean;

	protected async init(): Promise<void> {
		if (this.initialized) {
			return;
		}
		this.logger = await Logger.child('PmdLanguageManager');
		this.config = await Controller.getConfig();
		this.initialized = true;
	}

	public resolveLanguageAlias(alias: string): string {
		if (VALID_LANGUAGES_BY_ALIAS.has(alias.toLowerCase())) {
			const lang = VALID_LANGUAGES_BY_ALIAS.get(alias.toLowerCase());
			this.logger.trace(`Resolving language alias ${alias} to ${lang}`);
			return lang;
		} else {
			this.logger.trace(`No language found for alias ${alias}`);
			return null;
		}
	}

	public async getSupportedLanguages(): Promise<string[]> {
		const aliases = await this.config.getSupportedLanguages(ENGINE.PMD);
		const langs: string[] = [];
		for (const alias of aliases) {
			const lang = this.resolveLanguageAlias(alias);
			if (lang) {
				if (LANGUAGE.JAVASCRIPT === lang) {
					throw SfdxError.create('@salesforce/sfdx-scanner', 'PmdCatalogWrapper', 'JavascriptNotSupported');
				} else if (!SUPPORTED_LANGUAGES.has(lang)) {
					uxEvents.emit(
						'warning-always',
						eventMessages.getMessage('warning.langMarkedForDeprecation', [lang])
					);
				}
				langs.push(lang);
			} else {
				this.logger.trace(`Default-supported language alias ${alias} could not be resolved.`);
				throw SfdxError.create('@salesforce/sfdx-scanner', 'PmdLanguageManager', 'InvalidLanguageAlias', [alias]);
			}
		}
		return langs;
	}
}

export async function getSupportedLanguages(): Promise<string[]> {
	INSTANCE = INSTANCE || await PmdLanguageManager.create({});
	return await INSTANCE.getSupportedLanguages();
}

export async function resolveLanguageAlias(alias: string): Promise<string> {
	INSTANCE = INSTANCE || await PmdLanguageManager.create({});
	return INSTANCE.resolveLanguageAlias(alias);
}
