$(function(){
    var icon = $('.icon'),
        menu = $('.menu');
    createMenu(icon, menu);
  });
  
  
  function createMenu(icon, menu){
    //icon stylize
    icon.html('<span/><span/><span/><span/>');
    
    //menu stylize
    menu.addClass('menuClosed');
    
    var elem = menu.children('div');
    var l = elem.length;
    
    var opts = {
      startAng: 0, //degree
      range: 360,  //degree
      radius: 70,  //pixel
      nextTime: 50, //ms, time for next content to reveal, 0 for all at once
      animTime: 300, //ms, time for animation
      easingShow: 'easeOutBack', //limited strings
      easingHide: 'easeInBack', //limited strings
    }
    
    var n = ((opts.range == 360)? l:l-1);
    var interval = opts.range/n;
    
    var tarX = [], tarY = [];
    for(var i=0; i<l; i++){
      var ang = ((interval*i + opts.startAng)*Math.PI/180);
      
      tarX[i] = Math.round(Math.cos(ang)*opts.radius);
      tarY[i] = Math.round(Math.sin(ang)*opts.radius);
    }
    
    icon.click(function(e){
       if(menu.is('.menuClosed')){
        for(var i=0; i<l; i++){
         (function(j){
          setTimeout(function(){
           elem.eq(j).show().animate({
            'left':tarX[j],
            'top':tarY[j],
            'opacity':1,
           }, opts.animTime, opts.easingShow, function(){
             if(j == l-1){
              menu.removeClass('menuClosed').addClass('menuOpened');
              icon.addClass('iconOpened');
             }
           });
          },opts.nextTime*j);
         })(i);
        }
       } else if(menu.is('.menuOpened')){
        for(var i=l-1; i>=0; i--){
         (function(j){
          setTimeout(function(){
           elem.eq(j).animate({
            'left':0,
            'top':0,
            'opacity':0,
           }, opts.animTime, opts.easingHide, function(){
            $(this).hide();
            
            if(j == 0) {
             menu.removeClass('menuOpened').addClass('menuClosed');
             icon.removeClass('iconOpened');
            }
           });
          },opts.nextTime*(l-j-1));
         })(i);
        }
       }
     e.preventDefault(); 
    });
  }