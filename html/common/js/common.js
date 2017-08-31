(function ($){
	var
		  ns		= (new Date).getTime()
		, special	= $.event.special
		, dispatch	= $.event.handle || $.event.dispatch

		, scroll		= 'scroll'
		, scrollStart	= scroll + 'start'
		, scrollEnd		= scroll + 'end'
		, nsScrollStart	= scroll +'.'+ scrollStart + ns
		, nsScrollEnd	= scroll +'.'+ scrollEnd + ns
	;

	special.scrollstart = {
		setup: function (){
			var pid, handler = function (evt/**$.Event*/){
				if( pid == null ){
					evt.type = scrollStart;
					dispatch.apply(this, arguments);
				}
				else {
					clearTimeout(pid);
				}

				pid = setTimeout(function(){
					pid = null;
				}, special.scrollend.delay);

			};

			$(this).bind(nsScrollStart, handler);
		},

		teardown: function (){
			$(this).unbind(nsScrollStart);
		}
	};

	special.scrollend = {
		delay: 300,

		setup: function (){
			var pid, handler = function (evt/**$.Event*/){
				var _this = this, args = arguments;

				clearTimeout(pid);
				pid = setTimeout(function(){
					evt.type = scrollEnd;
					dispatch.apply(_this, args);
				}, special.scrollend.delay);

			};

			$(this).bind(nsScrollEnd, handler);

		},

		teardown: function (){
			$(this).unbind(nsScrollEnd);
		}
	};


	$.isScrolled = false;
	$(window).bind(scrollStart+' '+scrollEnd, function (evt/**Event*/){
		$.isScrolled = (evt.type == scrollStart);
		$('body')[$.isScrolled ? 'addClass' : 'removeClass']('is-scrolled');
	});
})();


//스크롤시 top버튼
$(function(){
	$(".btn_top_move").on("topBtnClick", function() {//170724fix top버튼
		$(this).off("click").on("click", function() {
			$('html, body').stop().animate({scrollTop: 0}, 250);
			return false;
		});
	}).trigger("topBtnClick");//end
	//$(".btn_top_move").triggr("topBtnClick");//재사용시

});

$(window).on('scrollend', function(){
	var posF = $(document).scrollTop();
	var flag = true;
	var end = 400;
	if( posF > end){
		flag = false;
		$('body').append('<span class="btn_top_move"></span>');
		$(".btn_top_move").triggr("topBtnClick");
		if ( $('.btn_top_move:visible').length == 0 ) {
			$(".btn_top_move").css("display","block");
		}
	}else{
		flag = true;
		$(".btn_top_move").remove();
	}
});//end

//페이지 초기화
$(function(){

	$("a").on("click", function (event) {//a링크 전체 #, 페이지 이동 초기화 (170818: 개발적용시 재사용문제)
		var e = event || window.event;
		e.preventDefault();
	});//end

	$(".select select").on("selectCssEvent", function() {//셀렉트박스 선택시
		$(this).off("focus").on("focus", function() {
			$(".div_select a").removeClass("focus");
			$(this).parent().addClass("focus");
			$(this).addClass("current");
		});
		$(this).off("blur").on("blur", function() {
			$(this).parent().removeClass("focus");
		});
	}).trigger("selectCssEvent");//end
	//$(".select select").triggr("selectCssEvent");//재사용시

	$(".checkbox input").on("checkCssEvent", function() {//체크박스 선택시
		$(this).off("click").on("click", function() {
			if(this.checked){
				$(this).parent().addClass("focus");
			}else{
				$(this).parent().removeClass("focus");
			}
		});
	}).trigger("checkCssEvent");//end
	//$(".checkbox input").triggr("checkCssEvent");//재사용시

	$(".radio input").on("radioCssEvent", function() {//체크박스 선택시
		$(this).off("click").on("click", function() {
			var ra_name = $(this).attr('name');
			$(".radio input:radio[name ="+ra_name+"]").parent().removeClass("focus");
			$(this).parent().addClass("focus");
		});
	}).trigger("radioCssEvent");//end
	//$(".radio input").triggr("radioCssEvent");//재사용시

	$(".input_in input, .idnumber input").on("inputInCssEvent", function() {//인풋 조합 선택시 170724fix
		$(this).off("focus").on("focus", function() {
			$(this).parent().parent().addClass("focus");
		});
		$(this).off("blur").on("blur", function() {
			$(this).parent().parent().removeClass("focus");
		});
	}).trigger("inputInCssEvent");//end
	//$(".input_in input").triggr("inputInCssEvent");//재사용시

	$(".input_in a").on("inputInCssEvent2", function() {//인풋 조합 선택시 div
		$(this).off("click").on("click", function() {
			$(this).parent().addClass("focus");
			return false;
		});
		$(this).off("blur").on("blur", function() {
			$(this).parent().removeClass("focus");
		});
	}).trigger("inputInCssEvent2");//end
	//$(".input_in input").triggr("inputInCssEvent2");//재사용시

	//#####검색 : start
	$(".search_input input").on("searchCssEvent", function() {//검색박스 선택시
		$(this).off("focus").on("focus", function() {
			$(this).parent().parent().addClass("focus");
			$(this).parent().parent().find(".search_submit").addClass("on");//검색 아이콘
		});
		$(this).off("blur").on("blur", function() {
			$(this).parent().parent().removeClass("focus");
			$(this).parent().parent().find(".search_submit").removeClass("on");//검색 아이콘
		});
	}).trigger("searchCssEvent");//end
	//$(".search_input input").triggr("searchCssEvent");//재사용시

	$(".search_input .search_cancel").on("searchResetEvent", function() {//검색 텍스트 리셋
		$(this).off("click").on("click", function() {
			$(this).parent().find("input").val("");
			return false;
		});
	}).trigger("searchResetEvent");//end
	//$(".search_input .search_cancel").triggr("searchResetEvent");//재사용시
	//#####검색 : end

	//div_select
	$(".div_select a").click(function(){
		$(".div_select a").removeClass("focus");
		$(this).addClass("focus");
		$(this).next().slideToggle(10);
		return false;
	});
	$(".div_select a").blur(function(){
		$(".div_select a").removeClass("focus");
	});
	$(".div_select .optionList li").click(function(){
		var option_txt = $(this).text();
		$(this).parent().parent().find("li").removeClass("on");
		$(this).addClass("on");//option focus
		$(this).parent().parent().parent().find("a").addClass("focus");//select focus
		$(this).parent().parent().parent().find("a").text(option_txt);
		$(this).parent().parent().slideToggle(10);
		return false;
	});
	$(".div_select").mouseleave(function(){
		$(this).find(".sub").slideUp(10);
	});//end

	////// account_select 계좌선택 - START
	$(".account_select").on("accSelectSet", function () {

		$("a", $(this)).off("accountSelect").on("accountSelect", function() {//계좌선택 셀렉트박스
			$(this).off("click").on("click", function() {
				//$(this).addClass("focus");  // 170818 디자인에서 삭제
				$(this).next().slideToggle(10);
				return false;
			});
			/*$(this).off("blur").on("blur", function() { // 170818 디자인에서 삭제
				$(".account_select a").removeClass("focus");
			});*/
		}).trigger("accountSelect");

		$(".optionList li", $(this)).off("accountLiSelect").on("accountLiSelect", function() {//계좌선택 셀렉트박스
			$(this).off("click").on("click", function() {
				var option_txt1 = $(this).find(".text").text();
				var option_txt2 = $(this).find(".number").text();
				var option_id = $(this).attr("id");
				if(option_id != undefined && option_id != ""){
					$(this).parents(".account_select").find("a .number").attr("id", option_id);// 170818 변경
				}
				$(this).parents(".account_select").find("li").removeClass("on");
				$(this).addClass("on");//option focus				
				//$(this).parents(".account_select a").addClass("focus");//select focus: 170818 디자인에서 삭제
				$(this).parents(".account_select").find("a .text").text(option_txt1);
				$(this).parents(".account_select").find("a .number").text(option_txt2);
				$(this).parents(".sub").slideToggle(10);		
				console.log(option_txt1 + " : " + option_txt2);
				return false;
			});
		}).trigger("accountLiSelect");

		$(".account_select").off("accountSelLeave").on("accountSelLeave", function() {//계좌선택 셀렉트박스 Leave
			$(this).off("mouseleave").on("mouseleave", function() {
				$(this).find(".sub").slideUp(10);
			});
		}).trigger("accountSelLeave");

	}).trigger("accSelectSet");
	////// account_select 계좌선택 - END


	//토스트 팝업
	var toastTimer = 1000; //토스트 타이머
	$(".toastPop").click(function(){
		var $popupid = $("#toastPop").find(".popup");
		var $toastText = $(this).attr("data-role");
		$("#toastPop .text").text($toastText);//텍스트

		if($(this).hasClass("impact")){
			$(".layer_popup.toast .popCont .pop_cont").addClass("impact");
		}
		$("#toastPop").css("display","block");
		var pop_width = $popupid.outerWidth()/2;
		var pop_height = $popupid.outerHeight()/2;

		$popupid.css({"margin-left": -pop_width});
		$popupid.css({"bottom":"30px", "position" : "fixed"});

		setTimeout(function(){
			//$("#toastPop").stop().fadeOut("slow");
			$("#toastPop").css("display","none");
			$(".layer_popup.toast .popCont .pop_cont").removeClass("impact");
		},toastTimer);
		return false;
	});//end

	//토글 컨텐츠
	$(".toggle_list").on("customToggle", function(event) {
		$("li > a", $(this)).off("click").on("click", function(event) {
			var e = event || window.event;
			var item = $(this).parents("li");
			
			e.preventDefault();
			
			if ( $(this).parents(".toggle_list").is("[data-toggle-disabled=true]") ) {
				return ;
			}
			
			if(!$(this).hasClass("on")){
				$(this).addClass("on");
				$(this).next().slideDown("fast", function(){
					$("body, html").scrollTop( item.offset().top );
				});
				$(this).find(".down").addClass("up");
			} else {
				$(this).removeClass("on");
				$(this).next().slideUp("fast");
				$(this).find(".down").removeClass("up");
			}
			
		});
	}).trigger("customToggle");

	//탭메뉴
	$(".tab_menu li a").click(function(){
		var active = $(this).data("tab-active") == false ? false : true;
		if ( !active ) {
			return false;
		}

		if(!$(this).parent().hasClass("focus")){
			$(".tab_menu li").removeClass("focus");
			$(this).parent().addClass("focus");
			var $tabId = $(this).attr("id");

			$(".tab_cont").removeClass("focus");
			$("#"+ $tabId +"_cont").addClass("focus");

		}
		return false;
	});//end

	//포트폴리오 결과 > 2줄 더보기
	$(".result_info_list li.row_more .td").click(function(){
		if(!$(this).hasClass("multui_none")){
			$(this).toggleClass("multi_line");
			$(this).parent().find(".bl_plus").toggleClass("minus")
		}
	});//end

	//$("body").click(function(){//body 클릭시 포커스 css blur//셀렉트, 계좌선택 170818: 삭제처리
		//$(".account_select a, .div_select a").removeClass("focus");
	//});//end

});//end


//레이어 팝업
function layerpopShow(popupid){
	var $popupid = $("#" + popupid).find(".popup");
	//$("#" + popupid).fadeIn("fast");
	$("#" + popupid).css("display","block");
	var pop_width = $popupid.outerWidth()/2;
	var pop_height = $popupid.outerHeight()/2;

	$popupid.css({"margin-left": -pop_width});

	if($popupid.height() < $(window).height()){
		$popupid.css({"top":"50%", "margin-top": -pop_height, "position" : "fixed"});
	}else{
		$popupid.css({"top": $("body").scrollTop(), "margin-top": 0, "position" : "absolute"});
	}
}
/*
$(window).resize(function(){
	var pop_width = $(".layer_popup").find(".popup").outerWidth()/2;
	var pop_height = $(".layer_popup").find(".popup").outerHeight()/2;

	$(".layer_popup").find(".popup").css({"margin-left": -pop_width});

	if($(".layer_popup").find(".popup").height() < $(window).height()){
		$(".layer_popup").find(".popup").css({"top":"50%", "margin-top": -pop_height, "position" : "fixed"});
	}else{
		$(".layer_popup").find(".popup").css({"top": $("body").scrollTop(), "margin-top": 0, "position" : "absolute"});
	}
});*/
$(function(){
	$(".bg_layer, .pop_cls, .popbtn, .popSelecter a").on("popCloseEvent", function() {//팝업닫기 170724fix 수정
		$(this).off("click").on("click", function() {
			//$(".layer_popup").fadeOut("fast"); return false;
			if(!$(this).hasClass("main")){
				$(".layer_popup").css("display","none");
			}
			return false;
		});
	}).trigger("popCloseEvent");//end
	//$(".bg_layer, .pop_cls").triggr("popCloseEvent");//재사용시


	//input type=tel 숫자만 입력가능
	$("input[type=tel]").on({
		keydown: function(event) {
			var e = event || window.event,
					keyID = (event.which) ? event.which : event.keyCode;
			if((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39) {
					return ;
			} else {
					event.target.value = event.target.value.replace(/[^0-9,]/g, "");
			}
		},
		keyup: function(event) {
			var e = event || window.event,
					keyID = (event.which) ? event.which : event.keyCode;
			if (keyID ==8 || keyID == 46 || keyID == 37 || keyID == 39) {
					return;
			} else {
					event.target.value = event.target.value.replace(/[^0-9,]/g, "");
			}
		}
	});

	//금융사 선택 탭 레이어
	$("[data-fc-choice]").on("afterClick", function() {
		$(this).off("click").on("click", function() {
			var pos = $(this).offset().top + $(this).outerHeight();
					choiceFlag = $(this).attr("data-fc-choice");

			if (choiceFlag == "true") {
				$('.fc_list_wrap').hide();
				$(this).attr("data-fc-choice", "false");
			} else {
				$('.fc_list_wrap').css({top: pos}).show();
				$(this).attr("data-fc-choice", "true");
			}
		});
	}).trigger("afterClick");

	$(".fc_list").off("click").on("afterClick", function() {
		$(this).find("label").on("click", function() {
			var fcName = $(this).text();
			$("[data-fc-choice]").text( fcName );
			$("[data-fc-choice]").trigger("click");
		});
	}).trigger("afterClick");


});//end

//4.1.3 투자상품 선택 - start
$(function(){
	$(".check_sel_list .rdio_box input").on("checkCssEvent", function() {//체크박스 선택시
		$(this).on("click", function() {
			if(this.checked){
				$(".check_sel_list .box").removeClass("on");
				$(this).parent().parent().addClass("on");
				$(".check_sel_list .is_account").css("display","none");
				$(this).parent().parent().find(".is_account").css("display","block");
			}else{
				//$(this).parent().parent().removeClass("on");
				//$(this).parent().parent().find(".is_account").css("display","none");
			}
		});
	}).trigger("checkCssEvent");//end
	//$(".checkbox input").triggr("checkCssEvent");//재사용시
});
//4.1.3 투자상품 선택 - END

//로보어드바이저 전용 - start
$(function(){
	var ChatdelaySpeed = 250; //170724fix 속도조절
	var ChatAniSpeed = 500; //170724fix 속도조절

	if($(".chatArea").length>0){//해당페이지가 챗ux 설문일때 body배경 바꿈
		$("body").css("background","#f7f7f7");
	}//end

	$(".chatboxArea:eq(0)").fadeIn(ChatdelaySpeed,function(){
		var this_num = $(this).index();
		var next_num =  this_num +1;
		$(this).animate({"margin-left":"0"}, ChatAniSpeed);

		$(".chatboxArea:eq("+next_num+")").fadeIn(ChatdelaySpeed,function(){
			$(this).animate({"margin-right":"0"}, ChatAniSpeed);
		});
	});

	$(".chatboxArea .chatbox input[type='checkbox'], .chatboxArea .chatbox input[type='radio']").on("checkClickEv", function() {//011. 체크박스나 라디오일때 체크하는 경우
		$(this).on("click", function(event) {

			event.stopPropagation();

			var $this_el;
			$this_el = $(this).parent().parent().parent().parent().next();
			$this_el_dir = $(this).parent().parent().parent().parent();

			$(this).parent().parent().parent().find("i.etc").removeClass("on");

			$this_el.fadeIn(ChatdelaySpeed,function(){
				var $this_offset = $this_el.offset().top;

				if(!$this_el.hasClass("btnArea")){ //마지막 버튼 영역이 아닐때
					$('html, body').stop().animate({scrollTop: $this_offset}, ChatAniSpeed);
				}else{//마지막 버튼 영역일때
					//$('.chatArea').css("padding-bottom","200px");
				}
				var this_num = $(this).index();
				var next_num =  this_num +1;
				$(this).animate({"margin-left":"0"}, ChatAniSpeed);
				$(".chatboxArea:eq("+next_num+")").fadeIn(ChatdelaySpeed,function(){
					$(this).animate({"margin-right":"0"}, ChatAniSpeed);
				});
			});

		});
	}).trigger("checkClickEv");//end
	//$(".chatboxArea .chatbox input[type='checkbox'], .chatboxArea .chatbox input[type='radio']").triggr("checkClickEv");////011.재사용시

	var this_val;
	$(".chatboxArea .chatbox input[type='text'], .chatboxArea .chatbox input[type='tel'], .chatboxArea .chatbox input[type='number']").on("textinputEv", function() {//012. 텍스트 계열 인풋박스일때 포커스 블러있때 실행
		$(this).off("blur").on("blur", function() {

			var $this_el;
			var $this_el_dir;
			if(!$(this).val()==""){//인풋박스에 값이 있다면

				if($(this).hasClass("only")){
					$this_el =  $(this).parent().parent().parent().parent().parent().next();
					$this_el_dir = $(this).parent().parent().parent().parent().parent();

					console.log("only 클래스 일때");
				}else{
					$this_el =  $(this).parent().parent().parent().parent().parent().parent().next();
					$this_el_dir = $(this).parent().parent().parent().parent().parent().parent();

					console.log("etc_only 클래스 일때");
				}


				$(this).parent().parent().parent().parent().find("input[type='checkbox'], input[type='radio']").each(function(){
					$(this).attr("checked",false);
				});

				$(this).parent().parent().find("i.etc").addClass("on");


				$this_el.fadeIn(ChatdelaySpeed ,function(){
					var $this_offset = $this_el.offset().top;

					if(!$this_el.hasClass("btnArea")){ //마지막 버튼 영역이 아닐때
						$('html, body').stop().animate({scrollTop: $this_offset}, ChatAniSpeed);
					}else{//마지막 버튼 영역일때
						//$('.chatArea').css("padding-bottom","200px");
					}
					var this_num = $(this).index();
					var next_num =  this_num +1;
					$(this).animate({"margin-left":"0"}, ChatAniSpeed);
					$(".chatboxArea:eq("+next_num+")").fadeIn(ChatdelaySpeed,function(){
						$(this).animate({"margin-right":"0"}, ChatAniSpeed);
					});
				});

			}else{//인풋에 값이 없다면
				$(this).parent().parent().find("i.etc").removeClass("on");
			}

		});
	}).trigger("textinputEv");//end
	//$(".chatboxArea .chatbox input[type='text'], .chatboxArea .chatbox input[type='tel'], .chatboxArea .chatbox input[type='number']").triggr("textinputEv");////012.재사용시

	$("i.etc").on("etcCheckEv", function() {//013. 일반 기타 인풋일때 활성화된 체크아이콘 클릭시
		$(this).off("click").on("click", function() {
			if(!$(this).next().find("input").val()==""){//값이 있을때

				$(this).parent().parent().parent().parent().find("input[type='checkbox'], input[type='radio']").each(function(){
					$(this).attr("checked",false);
				});

				$(this).parent().parent().find("i.etc").addClass("on");

			}
		});
	}).trigger("etcCheckEv");//end
	//$(".checkbox input").triggr("etcCheckEv");//013. 재사용시

	$(".chatboxArea .chatbox .average_click").on("averageClickEv", function() {//014. 평균보기
		$(this).off("click").on("click", function() {
			if(!$(this).hasClass("focus")){
				$(this).parent().parent().next().find(".average_txt").fadeIn();
				$(this).addClass("focus");
			}else{
				$(this).parent().parent().next().find(".average_txt").fadeOut();
				$(this).removeClass("focus");
			}
			return false;
		});
	}).trigger("averageClickEv");//end
	//$(".checkbox input").triggr("averageClickEv");//014. 재사용시

});//로보어드바이저 전용 - end


//파일 업로드 플러그인
$.fn.fileupload = function (options) {
	var $this, optionsType, defaultOptions, extendOptions, values;
	$this = $(this);
	defaultOptions = {
		fileLength: 4,
		inputIDPrefix: 'file',
		exeedAlertMsg: [this.fileLength, '까지 업로드가 가능합니다.'].join(""),
		serializeTarget: '.btnArea .btn.gray'
	};
	optionsType = Object.prototype.toString.call(options).toLowerCase().replace(/\[|\]/gi, "").split(" ")[1];
	extendOptions = null;

	optionsType == 'object' ? extendOptions = $.extend({}, defaultOptions, options) : console.error("options type is only Object!");

	$(extendOptions.serializeTarget).on("fileuploadSerialize", function(event) {
		var item, e;
		e = event || window.event;
		item = $this.find(".file_list > .file_item.hasFile");
		values = [];

		item.each(function (idx, el) {
			values.push($(el).find('input[type=file]')[0].value);
		});
	});

	$this.each(function (idx, item){
		var opt, listGroup, i;
		opt = extendOptions;
		listGroup = $(item).find('.file_list');
		i = 1;

		for ( ; i <= opt.fileLength; i += 1 ) {
			(function (j) {
				listGroup.append(
					["<div class='file_item'>\n", "<input type='file' id='", (opt.inputIDPrefix + j), "'>\n", "<p class='file_name'></p>\n", "<a href='javascript:;' class='delete' data-file-delete=''><span class='hidden'>삭제</span></a>\n", "</div>\n"].join("")
				);
			})(i);
		}

		$(item).find("[data-fileupload-trigger]").attr("for", opt.inputIDPrefix + 1);

		$(item).find("input[type=file]").on("fakeChange", function (event){

			$(this)
			.off("change").on("change", function (event){
				var e, currentFileLength, beforeItemLength, fileName, targetLabel, labelFor, labelForNum;
				e = event || window.event;
				currentFileLength = this.files.length;
				beforeItemLength = $(".file_list .file_item.hasFile").length;

				if (currentFileLength > 0 && beforeItemLength < 4) {
					fileName = $(this)[0].files[0].name;
					targetLabel = $("[data-fileupload-trigger]");
					labelFor = targetLabel.attr("for");
					labelForNum = parseInt(labelFor.replace(/[^0-9]/gi, ""));

					$(item).find(".file_list .no_data").hide();

					$(this).next(".file_name").text( fileName );
					$(this).parent().addClass("hasFile");

					beforeItemLength = $(item).find(".file_list .file_item.hasFile").length;

					$(extendOptions.serializeTarget).trigger("fileuploadSerialize");

					if ( beforeItemLength >= 4 ) {
						targetLabel.removeAttr("for").on("click", function (){
							alert(opt.exeedAlertMsg);
						});
					} else {
						targetLabel.attr({
								"for": (function () {
									var targetItem, length, i, nextID;
									targetItem = $(item).find(".file_list .file_item");
									length = targetItem.length;
									i= 0;
									nextID = '';

									for(; i < length; i+=1) {
										if (!targetItem.eq(i).hasClass("hasFile")) {
											nextID = targetItem.eq(i).find('input[type=file]').attr('id');
											break;
										}
									}

									return nextID;
								})()
							}).off("click");
						console.log(beforeItemLength);
					}
					$(item).find('.fileupload_cnt').html(
						["(<span class='txt_purple'>", values.length, "개의 사진</span>)"].join("")
					);
				}

			});

		}).trigger("fakeChange");

		$(item).find("[data-file-delete]").on("click", function (event){
			var e, target, nextID, targetLabel, noData, hasFile;
			e = event || window.event;
			target = $(this).siblings("input[type=file]");
			nextID = target.attr("id");
			targetLabel = $(item).find("[data-fileupload-trigger]");
			noData = $(item).find(".file_list .no_data");

			target[0].value = "";
			$(this).parent().removeClass("hasFile");
			targetLabel.attr("for", nextID);

			hasFile = $(item).find(".file_list .file_item.hasFile");

			if ( hasFile.length < 4) {
				targetLabel.off("click");
			}

			if ( hasFile.length == 0) {
				noData.show();
			}

			$(item).find('.fileupload_cnt').html(
				hasFile.length ? ["(<span class='txt_purple'>", hasFile.length, "개의 사진</span>)"].join("") : ""
			)
		});

	});

	return {
		serialize: function () {
			$(extendOptions.serializeTarget).trigger("fileuploadSerialize");
			return values;
		}
	}

};

$.fn.selectRage = function(start, end){
	return this.each(function(){
		if(this.setSelectionRange){
			this.focus();
			this.setSelectionRange(start, end);
		} else if(this.createTextRange){
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd("character", end);
			range.moveStart("character", start);
			range.select();
		}
	})
};

$.alert = function(callback, option) {
	console.log("$.alert");
	
	var positionStyle = "-webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);";
	var obj = {};
	var html = "";
	
	for ( var i in option ) {
		obj[i] = $.trim(option[i]);
	}
	
	html =  '<div class="layer_popup" id="popupid" style="display: block;">';
	html +=		'<div class="bg_layer"></div>';
	html += 	'<div class="popup" style="top: 50%; position: fixed;' + positionStyle + '">';
	html += 		'<div class="popCont">';
	if ( !!obj.title ) {
		html += 			'<h2 class="pop_tit">' + obj.title + '</h2>';
	}
	html += 			'<div class="pop_cont">';
	if ( !!obj.body ) {
		html += obj.body
	}
	html += 				'<div class="popbtnArea mt20">';
	if ( !!obj.ok ) {
		html += 					'<a href="javascript:;" onclick="window[\'' + callback + '\'](); $(this).parents(\'.layer_popup\').remove();" class="popbtn normal">' + (!!obj.ok ? obj.ok : '확인') + '</a>';
	}
	html += 				'</div>';
	html += 			'</div>';
	html += 		'</div>';
	html += 	'</div>';
	html += '</div>';
		
	$("body").append(html);
	
};

$.confirm = function(callback, option) {
	
	var positionStyle = "-webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);";
	var html = "";
	var obj = {};
	for ( var i in option ) {
		obj[i] = $.trim(option[i]);
	}
	
	
	html += '<div class="layer_popup" id="popupid2" style="display: block;">';
	html += 	'<div class="bg_layer"></div>';
	html += 	'<div class="popup" style="top: 50%; position: fixed;' + positionStyle + '">';
	html += 		'<div class="popCont">';
	if ( !!obj.title ) {
		html += 			'<h2 class="pop_tit">' + obj.title + '</h2>';
	}
	html += 			'<div class="pop_cont message">';
	if ( !!obj.body ) {
		html += 			obj.body;
	}
	html += 				'<div class="popbtnArea mt20">';
	html += 					'<a href="javascript:;" data-button-flag="cancel" class="popbtn grayline main">' + (!!obj.cancel ? obj.cancel : '취소') + '</a>';
	html += 					'<a href="javascript:;" data-button-flag="ok" class="popbtn normal">' + (!!obj.ok ? obj.ok : '확인') + '</a>';
	html += 				'</div>';
	html += 			'</div>';
	html += 		'</div>';
	html += 	'</div>';
	html += '<div>';
	
	$("body").append(html);
	$(".layer_popup").find('.popbtnArea > a').on("click", function(){
		
		var flag = $(this).data("button-flag");
		console.log(flag);
		
		$(this).parents('.layer_popup').remove();
		
		if ( flag == "cancel" ) {
			window[callback]({cd: "2"});
		} else if ( flag == "ok" ) {
			window[callback]({cd: "1"});
		}
		
	});

};