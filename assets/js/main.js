;
(function ($) {

    "use strict";

    /*===============================
         Language routing + app links
    ================================*/
    (function () {
        var SUPPORTED_LANGUAGES = ['es', 'en', 'pt'];
        var DEFAULT_LANGUAGE = 'en';
        var LANGUAGE_KEY = 'syncroclinic_language';
        var APP_BASE_URL = 'https://app.syncroclinic.com/';
        var PAGE_GROUPS = {
            home: {
                es: 'index.html',
                en: 'index-en.html',
                pt: 'index-pt.html'
            },
            demo: {
                es: 'demo.html',
                en: 'demo-en.html',
                pt: 'demo-pt.html'
            },
            pricing: {
                es: 'precios.html',
                en: 'pricing-en.html',
                pt: 'precos-pt.html'
            }
        };

        function normalizeLanguage(rawLanguage) {
            var value = (rawLanguage || '').toLowerCase();

            if (value.indexOf('es') === 0) return 'es';
            if (value.indexOf('pt') === 0) return 'pt';
            if (value.indexOf('en') === 0) return 'en';

            return DEFAULT_LANGUAGE;
        }

        function getCurrentPageLanguage() {
            var langFromHtml = document.documentElement.getAttribute('lang');
            return normalizeLanguage(langFromHtml);
        }

        function getPreferredLanguage() {
            var storedLanguage = localStorage.getItem(LANGUAGE_KEY);
            if (storedLanguage && SUPPORTED_LANGUAGES.indexOf(storedLanguage) > -1) {
                return storedLanguage;
            }

            var browserLanguage = '';
            if (navigator.languages && navigator.languages.length) {
                browserLanguage = navigator.languages[0];
            } else {
                browserLanguage = navigator.language || navigator.userLanguage || '';
            }

            return normalizeLanguage(browserLanguage);
        }

        function getPageGroup(pathname) {
            var filename = pathname.split('/').pop() || 'index.html';

            if (filename === '' || filename === 'index.html' || filename === 'index-en.html' || filename === 'index-pt.html') {
                return 'home';
            }

            if (filename === 'demo.html' || filename === 'demo-en.html' || filename === 'demo-pt.html') {
                return 'demo';
            }

            if (filename === 'precios.html' || filename === 'pricing-en.html' || filename === 'precos-pt.html') {
                return 'pricing';
            }

            return null;
        }

        function shouldRedirectToPreferredLanguage() {
            var pageGroup = getPageGroup(window.location.pathname);
            if (!pageGroup) return;

            var currentLanguage = getCurrentPageLanguage();
            var preferredLanguage = getPreferredLanguage();
            var targetPath = PAGE_GROUPS[pageGroup][preferredLanguage];
            var currentPath = window.location.pathname.split('/').pop() || 'index.html';

            if (!targetPath || currentPath === targetPath || currentLanguage === preferredLanguage) return;

            window.location.replace('/' + targetPath + window.location.search + window.location.hash);
        }

        function updateAppLinks(language) {
            var anchors = document.querySelectorAll('a[href^="' + APP_BASE_URL + '"]');
            anchors.forEach(function (anchor) {
                var url = new URL(anchor.href);
                url.searchParams.set('lng', language);
                anchor.href = url.toString();
            });
        }

        function setupLanguageSelectionPersistence() {
            var languageLinks = document.querySelectorAll('.lang-link');
            languageLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    var textLanguage = normalizeLanguage(link.textContent);
                    localStorage.setItem(LANGUAGE_KEY, textLanguage);
                });
            });
        }

        var currentLanguage = getCurrentPageLanguage();
        localStorage.setItem(LANGUAGE_KEY, currentLanguage);
        updateAppLinks(currentLanguage);
        setupLanguageSelectionPersistence();
        shouldRedirectToPreferredLanguage();
    })();


    /*===============================  
         Prealoder
    ================================*/
    jQuery(window).on('load', function (event) {
        jQuery('#preloader').delay(500).fadeOut(500);
    });


    /*===============================  
         Sticky
    ================================*/

    jQuery(window).on('scroll', function (event) {
        var scroll = jQuery(window).scrollTop();
        if (scroll < 110) {
            jQuery(".header-nav").removeClass("sticky");
        } else {
            jQuery(".header-nav").addClass("sticky");
        }
    });


    /*===============================  
         Mobile Menu 
    ================================*/

    jQuery(".navbar-toggler").on('click', function () {
        jQuery(this).toggleClass('active');
    });

    jQuery(".navbar-nav a").on('click', function () {
        jQuery(".navbar-toggler").removeClass('active');
    });
    var subMenu = jQuery(".sub-menu-bar .navbar-nav .sub-menu");

    if (subMenu.length) {
        subMenu.parent('li').children('a').append(function () {
            return '<button class="sub-nav-toggler"> <i class="fa fa-angle-down"></i> </button>';
        });

        var subMenuToggler = jQuery(".sub-menu-bar .navbar-nav .sub-nav-toggler");

        subMenuToggler.on('click', function () {
            jQuery(this).parent().parent().children(".sub-menu").slideToggle();
            return false
        });

    }




    /*===============================  
         faq accrodion
    ================================*/

    if (jQuery('.accrodion-grp').length) {
        var accrodionGrp = jQuery('.accrodion-grp');
        accrodionGrp.each(function () {
            var accrodionName = jQuery(this).data('grp-name');
            var Self = jQuery(this);
            var accordion = Self.find('.accrodion');
            Self.addClass(accrodionName);
            Self.find('.accrodion .accrodion-content').hide();
            Self.find('.accrodion.active').find('.accrodion-content').show();
            accordion.each(function () {
                jQuery(this).find('.accrodion-title').on('click', function () {
                    if (jQuery(this).parent().parent().hasClass('active') === false) {
                        jQuery('.accrodion-grp.' + accrodionName).find('.accrodion').removeClass('active');
                        jQuery('.accrodion-grp.' + accrodionName).find('.accrodion').find('.accrodion-content').slideUp();
                        jQuery(this).parent().parent().addClass('active');
                        jQuery(this).parent().parent().find('.accrodion-content').slideDown();
                    };


                });
            });
        });

    };
    

    /*===============================  
         BRAND ACTIVE SLICK JS
    ================================*/


    jQuery('.brand-active').slick({
        arrows: false,
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                }
            }, {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    });




    /*===============================  
         TESTIMONIAL ACTIVE SLICK JS
    ================================*/


    jQuery('.testimonial-active').slick({
        arrows: true,
        prevArrow: '<span class="prev"><i class="fal fa-arrow-left"></i></span>',
        nextArrow: '<span class="next"><i class="fal fa-arrow-right"></i></span>',
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode:true,
        centerPadding: "0px",
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                }
            }, {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    arrows: false,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,

                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    arrows: false,

                }
            }
        ]
    });




    /*===============================  
         TESTIMONIAL 7 ACTIVE SLICK JS
    ================================*/


    jQuery('.testimonial-7-active').slick({
        arrows: false,
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                }
            }, {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    arrows: false,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,

                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    arrows: false,

                }
            }
        ]
    });





    /*===============================  
         BRAND ACTIVE SLICK JS
    ================================*/


    jQuery('.brand-2-active').slick({
        arrows: false,
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 5,
                }
            }, {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,

                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,

                }
            }
        ]
    });




    /*===============================  
         FEEDBACK SLIDE SLICK JS
    ================================*/


    jQuery('.feedback-slide').slick({
        arrows: true,
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: '<span class="prev"><i class="fal fa-arrow-left"></i></span>',
        nextArrow: '<span class="next"><i class="fal fa-arrow-right"></i></span>',

    });

    /*===============================  
         REVIEW SLIDE SLICK JS
    ================================*/


    jQuery('.review-slide').slick({
        arrows: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: '<span class="prev"><i class="fal fa-arrow-left"></i></span>',
        nextArrow: '<span class="next"><i class="fal fa-arrow-right"></i></span>',

    });



    /*===============================  
         SCREENSHORS ACTIVE SLICK JS
    ================================*/


    jQuery('.screenshorts-active').slick({
        arrows: false,
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode:true,
        focusOnSelect: true,
        centerPadding: "0px",
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                }
            }, {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,

                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,

                }
            }
        ]
    });





    /*===============================  
         Magnific Popup
    ================================*/
    
    jQuery('.video-popup').magnificPopup({
        type: 'iframe'
        // other options
    });
    
    
    /*===============================  
         Magnific Popup
    ================================*/
    
    jQuery('.image-popup').magnificPopup({
      type: 'image',
      gallery:{
        enabled:true
      }
    });


    /*===============================  
         counter up
    ================================*/

    jQuery('.counter').counterUp({
        delay: 10,
        time: 2000
    });



    /*===============================  
         counter up
    ================================*/


    if (jQuery('.wow').length) {
        var wow = new WOW({
            boxClass: 'wow', // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 150, // distance to the element when triggering the animation (default is 0)
            mobile: true, // trigger animations on mobile devices (default is true)
            live: true // act on asynchronously loaded content (default is true)
        });
        wow.init();
    }





    /*===============================  
         Back to top
    ================================*/


    jQuery(window).on('scroll', function (event) {
        if (jQuery(this).scrollTop() > 600) {
            jQuery('.back-to-top').fadeIn(200)
        } else {
            jQuery('.back-to-top').fadeOut(200)
        }
    });


    /*===============================  
         Animate the scroll to yop
    ================================*/

    jQuery('.back-to-top').on('click', function (event) {
        event.preventDefault();

        jQuery('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });





    /*===============================  
         pricing plan js active
    ================================*/



    if (jQuery('#switch-toggle-tab').length) {
        var toggleSwitch = jQuery('#switch-toggle-tab label.switch');
        var TabTitle = jQuery('#switch-toggle-tab li');
        var monthTabTitle = jQuery('#switch-toggle-tab li.month');
        var yearTabTitle = jQuery('#switch-toggle-tab li.year');
        var monthTabContent = jQuery('#month');
        var yearTabContent = jQuery('#year');
        // hidden show deafult;
        monthTabContent.fadeIn();
        yearTabContent.fadeOut();

        function toggleHandle() {
            if (toggleSwitch.hasClass('on')) {
                yearTabContent.fadeOut();
                monthTabContent.fadeIn();
                monthTabTitle.addClass('active');
                yearTabTitle.removeClass('active');
            } else {
                monthTabContent.fadeOut();
                yearTabContent.fadeIn();
                yearTabTitle.addClass('active');
                monthTabTitle.removeClass('active');
            }
        };
        monthTabTitle.on('click', function () {
            toggleSwitch.addClass('on').removeClass('off');
            toggleHandle();
            return false;
        });
        yearTabTitle.on('click', function () {
            toggleSwitch.addClass('off').removeClass('on');
            toggleHandle();
            return false;
        });
        toggleSwitch.on('click', function () {
            toggleSwitch.toggleClass('on off');
            toggleHandle();
        });
    }




    /*===============================  
         ...
    ================================*/









})(jQuery);
