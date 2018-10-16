 /** Implement a minimal 'process' to support node module 'path' used by remark **/
 

 if(!!window && !window.process) {
  (window as any).process = {
    env: { DEBUG: undefined },
    platform: "",
    cwd: function(){}
  }
}
