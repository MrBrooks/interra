/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

var GLOBAL_CONSTANT = {
  mobile_width: 1023
};

$(window).load(function(){
  $("#preloader").removeClass('active');
});
$(document).ready(function() {
  var scrollMagicController = new ScrollMagic.Controller();
  var menu = new Menu();
  var targetScroll = new TargetScroll();
  var langsSwitcher = new LanguageSwitcher();
  var simpleSlider = new SimpleSlider();
  var displaceSLider = new DisplaceSlider();
  var projectSlider = new ProjectSlider({}, scrollMagicController);
  var fullProjectSlider = new SimpleFadeSlider({
    selector: "#full-project-slider"
  });
  var popups = new Popup();
  var teamSlider = new TeamSlider();
  var tabs = new Tabs();
  ajaxImitation(); //TODO: to remove
  var videoBlock = new VideoBlock(youtubePlayer);

  var injector = new Injector([
    {
      selector: "#arrow-prev",
      template: '<div class="arrow-btn-left"><div class="arrow"><div class="tail"></div><div class="triangle"><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>'
    },
    {
      selector: "#arrow-next",
      template: '<div class="arrow-btn-right"><div class="arrow"><div class="tail"></div><div class="triangle"><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>'
    },
  ]);
});


function MenuBtn(menu){
  var state = 'close', btn, body;

  function init(){
    body = $('body,html');
    btn = $('.menu-btn');
    btn.on('click', toggleState);
  }

  function toggleState(){
    if(state === 'open'){
      btn.removeClass('open');
      menu.removeClass('open');
      body.removeClass('noscroll');
      state = 'close';
    } else{
      btn.addClass('open');
      menu.addClass('open');
      body.addClass('noscroll');
      state = 'open';
    }
  }
  init();
}

function Menu(){
  var btn, menu;

  function init(){
    menu = $('#menu');
    btn = new MenuBtn(menu);
  }

  init();
}

function LanguageSwitcher(){

  var langs;

  function init(){
    langs = $(".lang-switcher span");
    langs.on('click', onClick);
  }

  function onClick(e){
    langs.removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  }
  init();
}

function SimpleSlider(){
  var tiker;

  function init(){
    tiker = new ClassTiker({
      selector: '.simple-slider .slide'
    });
  }

  init();
}

function SimpleFadeSlider(config){
  var defs = {
    selector: ".simple-fade-slider",
    next: ".next",
    prev: ".prev",
    active: "active",
    slide: ".item",
    anim_dutarion: 500
  };

  var opts = $.extend(defs, config);

  var slider, next, prev, curr, slides, count;

  function init(){
    slider = $(opts.selector);
    if(slider.length !== 0){
      prev = slider.find(opts.prev);
      next = slider.find(opts.next);
      slides = slider.find(opts.slide);
      count = slides.length;
      curr = 0;

      next.on('click', nextSlide);
      prev.on('click', prevSlide);
    }
  }

  function nextSlide(){
    curr = (curr+1) % count;
    slides.removeClass(opts.active);
    $(slides[curr]).addClass(opts.active);
  }
  function prevSlide(){
    curr = curr === 0? count - 1: curr - 1;
    slides.removeClass(opts.active);
    $(slides[curr]).addClass(opts.active);
  }


  init();
}

function ClassTiker(options){
  var defs = {
    selector: '.tik',
    active: 'active',
    delay: 10000,
    beforeTik: function(){},
    afterTik: function(){}
  };

  var opts = $.extend(defs, options);
  var elements, interval, curr, count, self = this;

  function init(){
    curr = 0;
    elements = $(opts.selector);
    count = elements.length;
    interval = setInterval(tik, opts.delay);
  }

  function tik(){
    opts.beforeTik(self);
    elements.removeClass(opts.active);
    curr = (curr + 1) % count;
    elements.eq(curr).addClass(opts.active);
    opts.afterTik(self);
  }

  this.start = function(){
    interval = setInterval(tik, opts.delay);
  };

  this.stop = function(){
    clearInterval(interval);
  };


  init();
}

function DisplaceSlider(conf) {
  var defs = {
    slider: "#displace-slider",
    slides: ".item",
    bg: ".bgitem",
    text: ".titem",
    prev: ".prev",
    next: ".next",
    active: "active",
    leftPart: ".left",
    rightPart: ".right",
    maxDisplace: 20,
    easing: function (x) {
      return x;
    },
  };

  var config = $.extend(defs, conf);

  var slider, slidesL, slidesR, bgs, text, current, next, prev, count, displace, leftPart, rightPart, animFlag, timer;

  function init(){
    slider = $(config.slider);
    if(slider.length === 0){
      return 0;
    }
    leftPart = slider.find(config.leftPart);
    rightPart = slider.find(config.rightPart);
    slidesL = slider.find(config.leftPart+" "+config.slides);
    slidesR = slider.find(config.rightPart+" "+config.slides);
    bgs = slider.find(config.bg);
    text = slider.find(config.text);
    next = slider.find(config.next);
    prev = slider.find(config.prev);
    current = 0;
    count = slidesL.length;
    animFlag = false;

    prev.on('click',Prev);
    next.on('click',Next);
    $(document).on('mousemove', updateDisplace);

  }

  function Prev(){
    if( current === 0){
      current = count - 1;
    } else{
      --current;
    }
    updateSlide();
  }

  function Next(){
    current = (current + 1) % count;
    updateSlide();
  }

  function updateSlide(){
    updateBg();
    updateParts();
    updateText();
  }

  function updateBg(){
    bgs.removeClass(config.active);
    bgs.eq(current).addClass(config.active);
  }

  function updateParts(){
    slidesL.removeClass(config.active);
    slidesR.removeClass(config.active);
    slidesR.eq(current).addClass(config.active);
    slidesL.eq(current).addClass(config.active);
  }

  function updateText(){
    text.removeClass(config.active);
    text.eq(current).addClass(config.active);
  }

  function updateDisplace(e){
    if(animFlag === true){
      return 0;
    }
    animFlag = true;
    timer = setTimeout(function(){
      displace = config.easing((2*e.clientY/$(window).height() - 1))*config.maxDisplace;
      leftPart.css("transform","translateY("+(displace)+"px)");
      rightPart.css("transform","translateY("+(-displace)+"px)");
      animFlag = false;
    },50);
  }

  init();
}

function ProjectSlider(conf, SM){
  var defs = {
    slider: "#project-slider",
    slides: ".slide",
    prev: ".prev",
    next: ".next",
    active: "active",
    leftPart: ".image-left",
    rightPart: ".image-right",
    scope: 500, //px
    maxDisplace: 50,
    easing: function(x){
      if( x > 0){
        return x < 1 ? x : 1;
      } else{
        return x > -1 ? x : -1;
      }
    },
  };

  var config = $.extend(defs,conf);

  var slider, slides, current, next, prev, count, leftPart, rightPart, displace, scene;

  function init(){
    slider = $(config.slider);
    if(slider.length !== 0){
      slides = $(config.slider + " " + config.slides);
      prev = $(config.slider + " " + config.prev);
      next = $(config.slider + " " + config.next);
      count = slides.length;
      current = 0;
      if(config.scope < $(window).height()){
        config.scope = $(window).height();
      }
      slider.children(".slides").width(slider.width());
      updateParts();

      prev.on('click', Prev);
      next.on('click', Next);

      initSM();
    }
  }

  function updateDisplace(e){
    displace = (e.progress - 0.5)*2*config.maxDisplace;
    leftPart.css('transform', 'translateY('+displace+'px)');
    rightPart.css('transform', 'translateY('+(-displace)+'px)');
  }

  function updateParts(){
    leftPart = $(config.slider + " .active " + config.leftPart);
    rightPart = $(config.slider + " .active " + config.rightPart);
  }

  function Switch(){
    slides.removeClass(config.active);
    $(slides[current]).addClass(config.active);
    updateParts();
    updateDisplace({progress: displace/config.maxDisplace/2 + 0.5});
  }

  function Prev(){
    if(current === 0){
      current = count - 1;
    } else {
      current = (current - 1) % count;
    }
    Switch();
  }

  function Next(){
    current = (current + 1) % count;
    Switch();
  }

  function initSM(){
    scene = new ScrollMagic.Scene({
      triggerElement: slider.get(0),
      duration: $(window).height(),
      triggerHook: 0.8

    }).addTo(SM);
    scene.on('progress', updateDisplace);
  }

  init();
}

function TeamSlider(){

  var slider;

  function init(){
    slider = $('#team-slider').owlCarousel({
      items: 4,
      margin: 10,
      nav: true,
      loop: true,
      navText: ["<div id='arrow-prev'>","<div id='arrow-next'>"],
      responsive : {
        0 : {
          items : 1,
        },
        1023 : {
          items : 4,
        }
      }
    });
  }

  init();
}

function Injector(config){

  function init(){
    var count = config.length;
    for(var i = 0; i < count; i++){
      $(config[i].selector).before(config[i].template).detach();
    }
  }

  init();
}

function VideoBlock(initializer){
  var video, btn;

  function init(){
    video = $('#video-player');
    if(video.length !== 0){
      btn = $('#video-play-btn');

      btn.on('click', onBtnClick);
    }
  }

  function onBtnClick(){
    var parent = $(this).parent();
    parent.removeClass('active');
    parent.siblings().addClass('active');
    initializer.play();
  }

  init();
}

function Tabs(config) {
  var defs = {
    select: ".tabs",
    paginations: ".pag",
    tab: ".tab",
    active: "active",
    attr: 'data-index'
  };

  var opts = $.extend(defs, config);
  var tabs;

  function init(){
    tabs = $(opts.select);
    if(tabs.length !== 0){
      tabs.each(initEach);
    }
  }

  function initEach(){
    var self = $(this);
    var pag = self.find(opts.paginations);
    var tab = self.find(opts.tab);
    tab.parent().css('min-height',getMaxHeight(tab)+"px");
    if(true){
      initMobile(this, pag, tab);
    }
    pag.on('click',onPagClick);
  }

  function initMobile(tabs ,pags, contents){
    var mtabs = $("<div class='mtabs'></div>");
    var count = pags.length, generated = [];
    for(var i = 0; i < count; i++){
      generated.push(initMTab(pags[i], contents[i]));
    }
    // console.log(generated);
    mtabs.append(generated);
    $(tabs).append(mtabs);
  }
  function initMTab(pag, content){
    var wrap = $("<div class='mtab'></div>"),
        mpag = $("<div class='mpag'></div>"),
        mcontent = $("<div class='mcontent'></div>");
    mcontent.append($(content).html());
    mpag.append($(pag).text());

    wrap.append(mpag);
    wrap.append(mcontent);
    wrap.on('click',function(){
      $(this).toggleClass(opts.active);
      mcontent.slideToggle(500);
    });

    return wrap;
  }

  function onPagClick(){
    var self = $(this);
    var parent = self.parent().parent();
    var index = self.attr(opts.attr);
    parent.find(opts.tab).removeClass(opts.active);
    parent.find(opts.tab+"["+opts.attr+"="+index+"]").addClass(opts.active);
    self.siblings().removeClass(opts.active);
    self.addClass(opts.active);

  }

  function getMaxHeight(arr){
    var h = 0;
    arr.each(function(){
      var ch = $(this).height();
      h = ch > h? ch: h;
    });
    return h;
  }

  init();
}

function Popup(){
  var btns, body;

  function init(){
    btns = $('.popup-open');
    if(btns.length !== 0) {
      body = $('html, body');
      btns.on('click', openTarget);
    }
  }

  function openTarget(){
    var target = $($(this).attr('data-target'));

    var close = target.find('.popup-close');
    target.addClass('active');
    blockScroll();
    close.on('click', function(){
      target.removeClass('active');
      allowScroll();
    });
  }

  function allowScroll(){
    body.removeClass('noscroll');
  }
  function blockScroll(){
    body.addClass('noscroll');
  }

  init();
}

function YoutubePlayerInit(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player, player_dom, id, v_width;
  player_dom = document.getElementById("video-player");
  if(player_dom){
    v_width = player_dom.clientWidth;
    id = player_dom.getAttribute('data-video-id');
  }

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-player', {
      // height: '390',
      width: v_width,
      videoId: id,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    // event.target.playVideo();
  }

  var done = false;

  function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
  }

  function stopVideo() {
    player.stopVideo();
  }

  this.onReady = function(){
    if(player_dom) {
      onYouTubeIframeAPIReady();
    }
  };

  this.play = function(){
    player.playVideo();
  };
  this.pause = function(){
    player.stopVideo();
  };
}

var youtubePlayer = new YoutubePlayerInit();

function onYouTubeIframeAPIReady(){
  youtubePlayer.onReady();
}

function TargetScroll(){
  var elems, body;


  function init(){
    body = $("html,body");
    elems = $(".scroll-trigger");
    elems.on('click', scrollToTarget);
  }

  function scrollToTarget(){
    var target = $($(this).attr("data-scroll-target"));
    body.animate({
      scrollTop: target.offset().top
    }, 500);
  }

  init();
}

function GoogleMapInit(){
  var map, map_dom;

  this.init = function(){
    map_dom = document.getElementById('map');
    if(map_dom) {
      map = new google.maps.Map(map_dom, {
        center: {lat: 59.910452, lng: 30.344012},
        zoom: 14,
        scrollwheel: false,
      });
      var marker = new google.maps.Marker({
        position: {lat: 59.911184, lng: 30.358373},
        map: map,
        icon: map_dom.getAttribute('data-marker-icon'),
        optimized: false
      });
    }
  };

}

var googleMap = new GoogleMapInit();

function initMap(){
  googleMap.init();
}

/*
GOOGLE MAP API KEY:
AIzaSyAqlocl5Cf_tjs-tAjmeFA9Qp0iowRN00o
*/

function ajaxImitation(){
  var preloader = $("#preloader");
  $("a").on('click', function(e){
    e.preventDefault();
    var href = $(this).attr('href');
    preloader.addClass("active");
    setTimeout(function(){
      window.location.href = href;
    }, 1500);
  });
}
