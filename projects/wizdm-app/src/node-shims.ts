/***************************************************************************************************
 * CUSTOM NODE SHIMS - since Angular is dropping node shims from version 6
 */

 /** Imlement a minimal 'process' to support node module 'path' used by remark **/
 (window as any).process = {
  env: { DEBUG: undefined },
  platform: "",
  cwd: function(){}
};