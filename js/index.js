(function () {
})();
var vm;
var app = {
    el: "#app",
    data() {
        return {
            name: "2021valentine",
            id: "",
            apiBaseUrl: "https://event.setn.com/ci",
            // apiBaseUrl: "http://127.0.0.1/ci",
            voteCount: 43200,
            voteList: [
                {
                    image:"images/pic1.jpg",
                    title:"「我要以後我們的愛情裡，沒有尊嚴，只有相守一生的執著」－《醉後決定愛上你》宋杰修 (2011)",
                    id:"51",
                },
                {
                    image:"images/pic2.jpg",
                    title:"「我要以後我們的愛情裡，沒有尊嚴，只有相守一生的執著」－《醉後決定愛上你》宋杰修 (2011)",
                    id:"52",
                },
                {
                    image:"images/pic3.jpg",
                    title:"「我要以後我們的愛情裡，沒有尊嚴，只有相守一生的執著」－《醉後決定愛上你》宋杰修 (2011)",
                    id:"53",
                },
                {
                    image:"images/pic4.jpg",
                    title:"「我要以後我們的愛情裡，沒有尊嚴，只有相守一生的執著」－《醉後決定愛上你》宋杰修 (2011)",
                    id:"54",
                }
            ],
            voteCurrent: "",
            voteBase:2,
            voteVar:4,
            emailRule:/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
            user: {
                login: false,
                id: "0",
                name: "",
                email: "",
                phone: "",
                token: "",
                hasExtraInfo: [],
                hasAgreed: null,
            },
            status: true,
            /* WARNING | REMINDER | NOTE | REGISTER | EMAIL */
            dialog: "",
        };
    },
    created: function () {
        // this.getVoteCount();
        // this.getVote();
    },
    computed: {},
    methods: {
        /**
         *  取得按讚次數
         */
        getVoteCount() {
            return axios({
                method: "get",
                url: this.apiBaseUrl + "/vote?event=" + this.name,
            }).then(function (response) {
                vm.voteCount = response.data;
            }).catch(function (error) {
                console.error(error);
            });
        },
        /**
         *  取得候選資料
         */
        getVote() {
            return axios({
                method: "get",
                url: this.apiBaseUrl + "/vote/candidate?event=" + this.name,
            }).then(function (response) {
                vm.voteList = response.data;
            }).catch(function (error) {
                console.error(error);
            });
        },
        checkAgree: function (news_id) {

            if (detectAgent.browser() != "Other") {
                this.toggleDialog('REMINDER');
                return false;
            }

            this.voteCurrent = news_id;
            if (!this.user.hasAgreed) {
                this.toggleDialog('REGISTER');
                return false;
            } else {
                this.start()
            }

        },
        start: function () {


            if (!vm.status) {
                return false;
            }

            if (!this.user.hasAgreed) {
                this.user.hasAgreed = false;
                animateCSS('.shake', 'headShake');
                return false;
            }
            if (!register()) {
                return false;
            }

            if (!registerCheck()) {
                this.toggleDialog('EMAIL');
                return false;
            }

            this.toggleDialog('');

            /**
             * Motion + likeCount
             */
            var likeCount = parseInt($(".like_" + vm.voteCurrent).html(), 10);
            $(".like_" + vm.voteCurrent).html(likeCount + 1)
            this.voteCount++;

            /**
             * 確認投票
             */
            vm.vote();

            /**
             * 鎖按鍵一秒
             */
            vm.status = false;
            setTimeout(() => {
                vm.status = true;
            }, 1000)
        },
        /**
         * 自填Email
         */
        updateEmail: async function () {
            if(vm.user.email.search(vm.emailRule)== -1){
                animateCSS('.email', 'headShake');
                return false;
            }
            vm.user.login = true;
            this.start();
        },
        /**
         * 投票
         */
        vote: async function () {
            var form = new FormData();
            form.append("event", this.name);
            form.append("member", this.user.id);
            form.append("email", this.user.email);
            form.append("candidate", this.voteCurrent);
            var rand = this.voteBase + Math.floor(Math.random() * Math.floor(this.voteVar));
            for (i = 1; rand >= i; i++) {
                await axios({
                    method: "post",
                    url: this.apiBaseUrl + "/vote",
                    data: form,
                }).then(function (response) {
                }).catch(function (error) {
                    console.error(error);
                });
            }
        },
        toThousands: function(num) {
            return (num || "0").toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
        /**
         *  滑動畫面特效
         */
        scrollMotion: function(id){
            // var extraOffset = 90;
            var extraOffset = 0;
            var target = $("#"+id);
            if (target) {
                $("html, body").animate({
                    scrollTop: target.offset().top - extraOffset
                }, "show");
                return false;
            }
        },
        toggleDialog: function (name) {
            this.dialog = this.dialog == name ? "" : name;
        },

        FacebookShare: function () {
            vm.toggleDialog("")
            facebookMe.target.refer = this.name;
            facebookMe.target.href = "https://acts.setn.com/event/2021valentine/index.html?utm_source=facebook";
            facebookMe.target.hashtag = "#情人節萬歲";
            facebookMe.share()
        }
    }
};

/**
 * 動畫效果
 *
 * @param {string} element
 * @param {string} animation
 * @param {string} prefix
 */
function animateCSS(element, animation, prefix = 'animate__') {

    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
        node.classList.remove(`${prefix}animated`, animationName);
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
};

/**
 * 檢查會員資訊齊全度
 */
function registerCheck() {
    if (!(vm.user.login)) {
        return false;
    }
    return true;
}

/**
 * 會員登入
 */
function register() {
    if (!vm.user.token.length) {
        openFacebookRegister();
        return false;
    }
    return true;
}

function openFacebookRegister() {
    window.open('https://memberapi.setn.com/Customer/FacebookLoginForEvent?e=' + vm.name, '', config = 'height=800,width=600');
    return true;
}

function callbackFacebookLogin(data) {
    if (data.result !== true) {
        return false;
    }


    vm.user.token = data.GetObject.token;
    $.ajax({
        method: "GET",
        url: "https://event.setn.com/api/user",
        data: { token: vm.user.token },
        dataType: "json",
        context: this,
        success: function (response) {
            vm.user.id = response.fb_id;
            vm.user.name = response.name;
            vm.user.email = response.email;
            vm.user.hasExtraInfo = response.hasExtraInfo;
            vm.start();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
$(document).ready(function () {

    if (document.location.protocol == "http:") {
        window.location.replace(window.location.href.replace("http:", "https:"));
    }
    vm = new Vue(app);

    window.addEventListener('message', function (event) {
        if ((event.origin.indexOf('setn.com') != -1) || (event.origin.indexOf('sanlih.com.tw') != -1) || (event.origin.indexOf('127.0.0.1') != -1)  ) {
            callbackFacebookLogin(event.data);
        }
    });

    $("#gotop").click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 1000);
    });
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#gotop').fadeIn("fast");
        } else {
            $('#gotop').stop().fadeOut("fast");
        }
    });
});

window.onload = function () {

    setTimeout(function () {
        $('.voteCarousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            dots: false,
            autoplay: true,
            navClass: ["carouselNav_prev", "carouselNav_next"],
            navText: [" ", " "],
            navContainerClass: "carouselNav",
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1200:{
                    items:3
                }
            }
        });
        $('.appCarousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            dots: false,
            autoplay: false,
            navClass: ["carouselNav_prevApp", "carouselNav_nextApp"],
            navText: [" ", " "],
            navContainerClass: "carouselNavApp",
            items: 1
        });
    }, 1800);
}


