plugins {
  java
  application
  id("de.undercouch.download") version "4.0.4"
}

group = "sfdx"
version = "1.0"

val distDir = "$buildDir/../../dist"

repositories {
  mavenCentral()
  google()
}

dependencies {
  implementation("com.google.guava:guava:28.0-jre")
  testImplementation("junit", "junit", "4.12")
  testImplementation("org.hamcrest:hamcrest:2.1")
  // Used in unit tests
  testImplementation(files("$buildDir/../../test/test-jars/apex/testjar-categories-and-rulesets-1.jar"))
}

configure<JavaPluginConvention> {
  sourceCompatibility = JavaVersion.VERSION_1_8
}

application {
  mainClassName = "sfdc.sfdx.scanner.pmd.Main"
}

// Running the cli locally needs the dist exploded, so just do that
// automatically with build for ease of use.
tasks.named<Sync>("installDist") {
  into("$distDir/pmd-cataloger")
}

tasks.named("assemble") {
  dependsOn("installDist")
}

