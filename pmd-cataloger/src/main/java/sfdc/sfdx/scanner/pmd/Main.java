package sfdc.sfdx.scanner.pmd;

public class Main {

	static String DIVIDER = "=";
	static String COMMA = ",";

	static final String NO_ARGUMENTS_FOUND = "No arguments found";
	static final String EXPECTED_DIVIDER = "Expected one " + DIVIDER + " in argument: %s";
	static final String MISSING_PARTS = "Missing language and/or paths in argument: %s";
	static final String NO_PATH_PROVIDED = "At least one path needs to be provided for language %s in argument: %s";

	public Main() {
	}

	/**
	 * Main entry to PMD Rule Catalog builder
	 *
	 * @param args should contain language separated by '=' from their comma-separated path mapping list. For example, here are some accepted arg values :
	 *             "apex=/some/lib/withjars,/more/path"
	 *             "javascript=/another/path,/yet/another/path/with/javascript/rules"
	 */
	public static void main(String[] args) {
		Main m = new Main();
		int c = m.countArgs(args);
		System.exit(args.length);
	}

	public int countArgs(String[] args) {
		return args.length;
	}
}
