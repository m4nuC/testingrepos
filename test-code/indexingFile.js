export { default as AccessAlarm } from "./AccessAlarm";

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
