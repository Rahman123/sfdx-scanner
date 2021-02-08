import {SfdxError} from '@salesforce/core';
import {FileHandler} from './FileHandler';
import {isText} from 'istextorbinary';
import isZip = require('is-zip');


export enum StaticResourceType {
	ZIP = 'zip',
	JS = 'js',
	TEXT = 'text',
	OTHER = 'other'
}

export class StaticResourceHandler {

	private resultCache: Map<string, StaticResourceType>;

	constructor() {
		this.resultCache = new Map();
	}

	public async identifyStaticResourceType(filename: string): Promise<StaticResourceType> {
		// If we've already cached a value for this file, we can return early.
		if (this.resultCache.has(filename)) {
			return this.resultCache.get(filename);
		}

		// Otherwise, we need to do some work. Spin up a FileHandler and use it to get the contents of the file as a buffer.
		const fh = new FileHandler();
		let buffer: Buffer = null;
		try {
			buffer = await fh.readFileAsBuffer(filename);
		} catch (e) {
			// We'll throw an error here, because being unable to parse a static resource is definitely a problem that
			// should be surfaced to the user.
			throw new SfdxError(`Could not read ${filename}: ${e.message || e}`);
		}

		let fileType: StaticResourceType = null;
		if (isText(null, buffer)) {
			fileType = StaticResourceType.TEXT
		} else if (isZip(buffer)) {
			fileType = StaticResourceType.ZIP;
		} else {
			fileType = StaticResourceType.OTHER;
		}
		this.resultCache.set(filename, fileType);
		return fileType;
	}
}
