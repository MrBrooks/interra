/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

$(window).load(function(){
  $("#preloader").removeClass('active');
});
$(document).ready(function() {
  var menu = new Menu();
  var targetScroll = new TargetScroll();
  var langsSwitcher = new LanguageSwitcher();
  var simpleSlider = new SimpleSlider();
  var projectSlider = new ProjectSlider();
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
    prev = slider.find(opts.prev);
    next = slider.find(opts.next);
    slides = slider.find(opts.slide);
    count = slides.length;
    curr = 0;

    next.on('click', nextSlide);
    prev.on('click', prevSlide);
  }

  function nextSlide(){
    slides.removeClass(opts.active);
    $(slides[++curr % count]).addClass(opts.active);
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
    delay: 4000,
    beforeTik: function(tiker){},
    afterTik: function(tiker){}
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
    $(elements.get(curr)).addClass(opts.active);
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

function ProjectSlider(conf){
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

  var slider, slides, current, next, prev, count, leftPart, rightPart, displace;

  function init(){
    slider = $(config.slider);
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

    $(window).on('scroll', onScroll);
  }

  function onScroll(){
    var sT = $(window).scrollTop();
    var c = slider.offset().top;// - slider.height()/2;
    var x = (sT - c) / config.scope;
    displace = config.easing(x)*config.maxDisplace;
    updateDisplace();
  }

  function updateDisplace(){
    leftPart.css('transform', 'translateY('+displace+'px)');
    rightPart.css('transform', 'translateY(-'+displace+'px)');
  }

  function updateParts(){
    leftPart = $(config.slider + " .active " + config.leftPart);
    rightPart = $(config.slider + " .active " + config.rightPart);
  }

  function Switch(){
    slides.removeClass(config.active);
    $(slides[current]).addClass(config.active);
    updateParts();
    onScroll();
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

  init();
}

function TeamSlider(){

  var slider;

  function init(){
    slider = $('#team-slider').owlCarousel({
      items: 4,
      margin: 10,
      nav: true,
      navText: ["<div id='arrow-prev'>","<div id='arrow-next'>"],
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
    btn = $('#video-play-btn');

    btn.on('click', onBtnClick);
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
    tabs.each(initEach);
  }

  function initEach(){
    var self = $(this);
    var pag = self.find(opts.paginations);
    var tab = self.find(opts.tab);
    tab.parent().css('min-height',getMaxHeight(tab)+"px");

    pag.on('click',onPagClick);
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
    body = $('html, body');
    btns.on('click', openTarget);

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
        zoom: 14
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