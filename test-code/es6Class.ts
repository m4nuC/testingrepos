/**
 * This is a normal class
 */
/* eslint-disable */
class thisIsAnES6Class {
  static staticMethod(someArg) {
    // This is a static method
    return 43;
  }

  /**
   * This is a static arrow method
   * @param something
   * @param somethingElse
   * @returns A string that says 'yeah'
   */
  static staticArrowMethod(something, somethingElse) {
    return "yeah";
  }

  /**
   * Private method that does not do much.
   */
  private privateMethod(iDoNothing) {}

  // Normal method with inline comments at the top
  normalMethod() {
    // and also in the body
    return "I like turtles";
  }

  instanceArrowMethod = (param: number) => {
    const localVarialble = "this is something";
    return param;
  };
}

/**
 * This is a normal class
 */
export class namedExportedClass {
  /**
   * This is a static arrow method
   * @param something
   * @param somethingElse
   * @returns {iAmAType} A string that says 'yeah'
   */
  static staticArrowMethod(something, somethingElse) {
    return "yeah";
  }
}

/**
 * This is a normal class
 */
export default class defaultExportedClass {
  /**
   * This is a static arrow method
   * @param something
   * @param somethingElse
   * @returns A string that says 'yeah'
   */
  static staticArrowMethod(something, somethingElse) {
    return "yeah";
  }
}
