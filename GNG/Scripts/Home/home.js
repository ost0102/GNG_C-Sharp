$(document).ready(function () {

	$("#Company").on('click', function () {
		location.href = '/Company/index';
	});
	$("#Business").on('click', function () {
		location.href = '/Business/index';
	});
	$("#Facility").on('click', function () {
		location.href = '/Facility/index';
	});

	$('input:text').keypress(function (e) {
		if (e.which == 13) {
			var inputs = $('input:text, textarea');
			var index = inputs.index(this);

			if (index > -1 && index < inputs.length - 1) {
				inputs[index + 1].focus();
				e.preventDefault(); 
			}
		}
	});

	$('textarea').keypress(function (e) {

	});

    $('#TEL').on('input', function () {
        var num = $(this).val().replace(/[^0-9]/g, ''); // 숫자가 아닌 모든 문자 제거
        var phone = '';

        if (num.length < 4) {
            phone = num;
        } else if (num.length < 7) {
            phone = num.substr(0, 3) + '-' + num.substr(3);
        } else if (num.length < 11) {
            phone = num.substr(0, 3) + '-' + num.substr(3, 3) + '-' + num.substr(6);
        } else {
            phone = num.substr(0, 3) + '-' + num.substr(3, 4) + '-' + num.substr(7);
        }

        $(this).val(phone);
	});

	$("#confirm_btn").click(function (e) {
		fnSendMail();
	});

});

$(document).on("click", ".search-btn > button", function () {
	window.open("http://wms.mygng.kr");
})


function fnSendMail() {
	try {
		if (fnValidation()) {

			var objJsonData = new Object();
			/*var emailReg = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;*/

			objJsonData.CUST = $("#CUST").val(); //회사명
			objJsonData.USER = $("#USER").val(); //고객명
			objJsonData.TEL = $("#TEL").val(); //연락처
			objJsonData.EMAIL = $("#EMAIL").val(); //이메일
			objJsonData.TITLE = $("#TITLE").val(); //제목
			objJsonData.CONTENTS = $("#CONTENTS").val(); //내용
			//if (emailReg.test(objJsonData.EMAIL)) {
			//	_fnAlertMsg('올바른 이메일 주소를 입력하세요.');
			//	return false;
			//}
			$.ajax({
				type: "POST",
				url: "/Home/fnSendEmail",
				async: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					if (result == null) {
						console.log(result);
						/*alert("메일 전송이 실패하였습니다. \n관리자에게 문의 하세요.");*/
						layerPopup('#alert01');
					} else {
						if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
							/*alert("문의해주셔서 감사합니다. 확인 후 답변드리겠습니다.");*/
							fnCompleteAlert("문의해주셔서 감사합니다. 확인 후 답변드리겠습니다.")
							initContent();
						}
						else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
							console.log(JSON.parse(result).Result[0]["trxMsg"]);
							_fnAlertMsg('메일 전송에 실패하였습니다. \n필수값을 입력해주세요.');
						}
					}
				},
				error: function (xhr) {
					console.log(xhr.message);
				}
			});
		}
	} catch (err) {
		console.log("[Error - fnSendMail()]" + err.message);
    }
}

function _fnMakeJson(data) {
	if (data != undefined) {
		var str = JSON.stringify(data);
		if (str.indexOf("[") == -1) {
			str = "[" + str + "]";
		}
		return str;
	}
}

//밸리데이션
function fnValidation() {
	//회사명 밸리데이션
	if (_fnToNull($("#CUST").val() == "")) {
		_fnAlertMsg("회사명을 입력 해 주세요.");
		return false;
	}

	//고객명 밸리데이션
	if (_fnToNull($("#USER").val() == "")) {
		_fnAlertMsg("고객명을 입력 해 주세요.");
		return false;
	}

	//연락처 밸리데이션
	if (_fnToNull($("#TEL").val() == "")) {
		_fnAlertMsg("연락처를 입력 해 주세요.");
		return false;
	}

	//이메일 밸리데이션
	var emailReg = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (_fnToNull($("#EMAIL").val() == "")) {
		_fnAlertMsg("이메일을 입력 해 주세요.");
		return false;
	}
	else if (!emailReg.test($("#EMAIL").val())) {
		_fnAlertMsg("이메일 형식이 올바르지 않습니다.");
		return false;
	}

	//제목 밸리데이션
	if (_fnToNull($("#TITLE").val() == "")) {
		_fnAlertMsg("제목을 입력 해 주세요.");
		return false;
	}

	//내용 밸리데이션
	if (_fnToNull($("#CONTENTS").val() == "")) {
		_fnAlertMsg("내용을 입력 해 주세요.");
		return false;
	}

	return true;
}

//Null 값 ""
function _fnToNull(data) {
	// undifined나 null을 null string으로 변환하는 함수. 
	if (String(data) == 'undefined' || String(data) == 'null') {
		return ''
	} else {
		return data
	}
}
//발리데이션 메시지
function _fnAlertMsg(msg, id) {
	$(".alert_cont .inner").html("");
	$(".alert_cont .inner").html(msg);
	if (_fnToNull(id) != "") {
		layerPopup('#alert01');
		closeVar = id;
	} else {
		layerPopup('#alert01');
	}
	$("#alert_close").focus();
}

//전송 성공 메시지
function fnCompleteAlert(msg) {
	$(".alert_cont .inner").html("");
	$(".alert_cont .inner").html(msg);
	layerPopup('#alert01');
}

//제보하기 팝업창 초기화
function initContent() {
	try {
		$("#EMAIL").val("");    //이메일 앞부분
		$("#CUST").val("");    //이메일 뒷부분		
		$("#CONTENTS").val(""); //이메일 콤보박스
		$("#TEL").val("");     //제목
		$("#USER").val("");//내용
		$("#TITLE").val("");//내용
	}
	catch (err) {
		console.log("[Error - initContent]" + err.message);
	}
}

/* 레이어팝업 */
var layerPopup = function (obj) {
	var $laybtn = $(obj),
		$glayer_zone = $(".layer_zone");
	if ($glayer_zone.length === 0) { return; }

	$glayer_zone.hide();
	$("body").addClass("layer_on");
	$("html").addClass("layer_on");
	$laybtn.fadeIn(200);
};

/* 레이어팝업 닫기 */
var layerClose = function (obj) {
	var $laybtn = $(obj);
	//$("body").removeClass("layer_on");
	//$("body").removeClass("noscroll");
	$laybtn.hide();
	$("body").removeClass("layer_on");
	$("html").removeClass("layer_on");
};