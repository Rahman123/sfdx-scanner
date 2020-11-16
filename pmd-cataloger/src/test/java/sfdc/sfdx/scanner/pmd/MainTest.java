package sfdc.sfdx.scanner.pmd;

import static org.junit.Assert.*;

import org.junit.Test;

public class MainTest {
	@Test
	public void verifyHappyCase() {

		Main m = new Main();
		final String[] args = {"/some/path1", "/some/other/path", "moreargs", "evenmoreargs"};
		assertEquals("Unexpected output", 4, m.countArgs(args));
	}

}
