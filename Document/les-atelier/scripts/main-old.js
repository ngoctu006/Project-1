"use strict";
window.LADV = window.LADV || {}, window.LADV.Index = function() {
    var i = {}, n = $(".index");
    var window_Width = n.width();
    return i.init = function() {
        if (!n.length)
            return !1;
        if (
                n.find(".section-owlcarousel-full").length &&
                n.find(".section-owlcarousel-full").owlCarousel({
                    center: !0,
                    items: 1,
                    loop: !0,
                    dots: !0,
                    nav: !0,
                    navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],
                    margin: 0
                }),
              n.find(".section-vos-envies").length &&               n.find(".section-team").length
          ) {

              
                       n.find(".section-vos-envies .owlcarousel-content").owlCarousel({
                                center:true,                          
                                items: 4,
                                loop: !0,
                                nav: !0,
                                navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],
                                merge: !0,
                                dots: !1,
                                responsive:{
                                    0:{
                                        items:2,
                                        mergeFit:true,
                                        margin: 10,
                                        merge: true
                                    },
                                    600:{
                                        items:4,
                                        margin: 20
                                    }
                                }
                        })
                var i = 5, e = !0, o = !0;
                if (n.find(".section-team").attr("data-item") &&  (i = n.find(".section-team").attr("data-item"), e = !1),  n.find(".section-team").attr("data-center")) 
                {
                    var t = n.find(".section-team").attr("data-center");
                     o = "true" === t
                }
         
                    n.find(".section-team .owlcarousel-content").owlCarousel({
                        center: o,
                        items: i,
                        loop: !0,
                        nav: !0,
                        navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],
                        merge: e,
                        margin: 10,
                        dots: !1,
                                responsive:{
                                    0:{
                                        items:1
                                    },
                                    600:{
                                        items:i
                                    }
                                }
                    })
          

            }
            if (n.find(".section-nos-conseillers").length) {
                var c = n.find(".section-nos-conseillers .owlcarousel-content");
                c.owlCarousel({center: !0,items: 1,loop: !0,nav: !0,navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 0}).on("change.owl.carousel", function(i) {
                    var e = i.page.index;
                    n.find(".section-owlcarousel-item .navigation a").removeClass("active"), $(n.find(".section-owlcarousel-item .navigation a")[e]).addClass("active")
                }), n.find(".section-owlcarousel-item .navigation a").click(function(i) {
                    i.preventDefault(), n.find(".section-owlcarousel-item .navigation a").removeClass("active"), $(this).addClass("active");
                    var e = parseInt($(this).attr("data-id")) - 1;
                    c.trigger("to.owl.carousel", e)
                })
            }
            n.find(".block-nos-brochures").length && n.find(".block-nos-brochures .owlcarousel-content").owlCarousel({
                center: !0,
                items: 1,
                loop: !0,
                nav: !0,
                navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 0
            }),
            n.find(".block-service").length && n.find(".block-service .owlcarousel-content").owlCarousel({
                    center: !0,
                    items: 1,
                    loop: !0,
                    nav: !0,navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 0
                })
    }, i
}(jQuery), 
window.LADV.TourDetail = function() {
    var i = {}, n = $(".tour-detail");
    return i.initUI = function() {
        n.find(".block-slider-day").length && n.find(".block-slider-day .owlcarousel-full").owlCarousel({center: !1,items: 10,loop: !1,dots: !1,nav: !0,autoWidth: !0,navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 1}), n.find(".block-silder-pointer-address").length && n.find(".block-silder-pointer-address").owlCarousel({center: !0,items: 1,loop: !0,dots: !1,nav: !0,navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 0}), n.find(".slider-decouvrez-aussi").length && n.find(".slider-decouvrez-aussi .owlcarousel-content").owlCarousel({center: !1,items: 4,loop: !0,dots: !1,nav: !0,navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 20}), n.find(".section-block-service").length && n.find(".section-block-service .owlcarousel-content").owlCarousel({center: !0,items: 1,loop: !0,dots: !1,nav: !0,navText: ['<i class="icon icon-prev"></i>', '<i class="icon icon-next"></i>'],margin: 0})
    }, i.init = function() {
        return n.length ? void i.initUI() : !1
    }, i
}(jQuery), 
jQuery(document).ready(function(i) {
    i(".gotop a").click(function(n) {
        n.preventDefault(), i("html, body").animate({scrollTop: 0}, 800)
    }), window.LADV.Index.init(), window.LADV.TourDetail.init()
});
