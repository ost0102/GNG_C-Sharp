﻿$(function () {
    function initializeSlider(sliderId, prevArrowClass, nextArrowClass) {
        var $slider = $(sliderId);

        $slider.children('div').each(function () {
            $(this).clone().appendTo($slider);
        });

        $slider.slick({
            slide: 'div',
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            speed: 500,
            arrows: true,
            dots: false,
            autoplay: false,
            autoplaySpeed: 10000,
            pauseOnHover: true,
            vertical: false,
            prevArrow: $(prevArrowClass),
            nextArrow: $(nextArrowClass),
            dotsClass: "slick-dots",
            draggable: true,
            responsive: [
                {
                    breakpoint: 1201,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 852,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 769,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 501,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }

    initializeSlider('#FacilitySlider', '.facility-prevArrow', '.facility-nextArrow');
    initializeSlider('#EquipmentSlider', '.equipment-prevArrow', '.equipment-nextArrow');
    initializeSlider('#EtcSlider', '.etc-prevArrow', '.etc-nextArrow');
});


$(document).ready(function () {
    $(".tab button").on("click", function () {
        // 모든 탭의 클래스를 'off'로 설정하고, 클릭된 탭만 'on'으로 설정
        $(".tab").addClass("off").removeClass("on");
        $(this).parent().addClass("on").removeClass("off");

        //클릭된 버튼의 data-target 속성에서 섹션 ID를 가져옴
        var target = $(this).attr("data-target");

        // 해당 섹션으로 스크롤 이동
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 500);
    });

    var contentsOffset = $('.section-tab').offset().top; // .contents의 초기 위치를 저장

    $(window).scroll(function () {
        if ($(window).scrollTop() > contentsOffset) {
            $('.section-tab').addClass('fixed');
            $('.GNG-section').addClass('fixed');
        } else {
            $('.section-tab').removeClass('fixed');
            $('.GNG-section').removeClass('fixed');
        }

        var scrollPos = $(document).scrollTop();

        // 각 섹션에 대해 반복 처리를 수행합니다.
        $('.GNG-item__box').each(function () {
            var currLink = $(this);
            var refElement = currLink.attr('id');

            // 섹션의 위치와 스크롤 위치를 비교하여 조건에 맞는 경우 처리합니다.
            var elemTop = $(this).position().top - 500;
            var elemHeight = $(this).outerHeight();
            if (elemTop <= scrollPos && elemTop + elemHeight > scrollPos) {
                // 모든 탭의 'on' 클래스를 제거합니다.
                $('.tab').removeClass('on');
                // 현재 섹션에 해당하는 탭에만 'on' 클래스를 추가합니다.
                $('.tab button[data-target="#' + refElement + '"]').parent().addClass('on');
            }
        });
    });
});
