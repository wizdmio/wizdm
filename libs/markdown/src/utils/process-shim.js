 /** Implement a minimal 'process' to support node module 'path' used by remark **/
 
 (function() {
 
  if(!!window && !window.process) {
    window.process = {
      env: { DEBUG: undefined },
      cwd: function(){ return '';},
      platform: ''
    }
  }
    
 })();
