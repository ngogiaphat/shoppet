;(function($) {

    "use strict";


    // Ace Editor Set Up
    ace.config.set("basePath",window.aceEditorBase);
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("cssData");
    editor.getSession().setMode("ace/mode/css");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setUseWrapMode(true);
    editor.$blockScrolling = Infinity;


    // enable autocompletion and snippets
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: false,
        enableLiveAutocompletion: true
    });

    // Set font size to editor
    if ($(window).height() > 790) {
        editor.setOptions({
            fontSize: "17px"
        });
    } else {
        editor.setOptions({
            fontSize: "15px"
        });
    }

    // Selector Separator
    window.separator = ' ';

    // All Yellow Pencil Functions.
    window.yellow_pencil_main = function() {

            // Cache left bar width.
            window.leftbarWidth = 46;

            // Onscreen plugin.
            $.expr[":"].onScreenFrame = function(n) {
                var t = $(document),
                    o = t.scrollTop(),
                    r = t.height(),
                    c = o + r,
                    f = $(document).find(n),
                    i = f.offset().top,
                    h = f.height(),
                    u = i + h;
                return i >= o && c > i || u > o && c >= u || h > r && o >= i && u >= c;
            };


            // Don't load again.
            if ($("body").hasClass("yp-yellow-pencil-loaded")){
                return false;
            }

            // For Custom Selector
            window.setSelector = false;

            // Check if re-undo buttons active.
            check_undoable_history();

            // Seting popular variables.
            var iframe = $('#iframe').contents();
            var iframeBody = iframe.find("body");
            var body = $(document.body).add(iframeBody);
            var mainDocument = $(document).add(iframe);
            var mainBody = $(document.body);


            // Adding yp-animating class to animating elements.
            iframe.find(window.basic_not_selector).on('animationend webkitAnimationEnd oanimationend MSAnimationEnd',function(){

                // Stop if any yp animation tool works
                if(body.hasClass("yp-anim-creator") || body.hasClass("yp-animate-manager-active")){
                    return false;
                }

                var element = $(this);

                // remove animating class.
                if(element.hasClass("yp-animating")){
                    element.removeClass("yp-animating");
                }

                // Set outline selected style if selected element has animating.
                if(element.hasClass("yp-selected") && is_content_selected()){
                    body.removeClass("yp-has-transform");
                    draw();
                }

                return false;

            });


            $(".yp-animate-manager-inner").on("scroll",function(){

                var l = $(this).scrollLeft();
                $(".yp-anim-control-right").css("left",-Math.abs(l));

                $(".yp-anim-left-part-column").css("left",l);

            });


            // Wireframe 
            $(".yp-wireframe-btn").click(function(){
                body.toggleClass("yp-wireframe-mode");
                $(".yp-editor-list > li.active > h3").trigger("click");
                gui_update();
            });


            // Nice logo rotation. per 1min.
            setInterval(function(){
                $(".yellow-pencil-logo").toggleClass("yp-logo-play");
            },80000);


            // Anim control
            $(".yp-anim-control-play").on("click",function(){

                if($(this).hasClass("active")){
                    return false;
                }

                body.addClass("yp-animate-manager-playing yp-clean-look yp-hide-borders-now");

                // Find largest line for play/stop.
                var maxWidth = Math.max.apply( null, $( '.yp-anim-process-inner' ).map( function (){
                    return $( this ).outerWidth( true );
                }).get() );


                var s = (parseFloat(maxWidth)/100);
                $("#yp-animate-helper").html("@-webkit-keyframes playingBorder{from{left: 0px;}to{left:"+maxWidth+"px;}}@keyframes playingBorder{from{left: 0px;}to{left:"+maxWidth+"px;}}");

                $(".yp-anim-playing-border").css("animation-duration",s+"s").css("-webkit-animation-duration",s+"s").addClass("active");

                $(this).addClass("active");

                var S_inMS = (s*1000);
                clear_animation_timer();

                window.animationTimer3 = setTimeout(function(){
                    $(".yp-anim-control-pause").trigger("click");
                },S_inMS);


                // Playing over width
                $(".yp-anim-playing-over").css("width",maxWidth+$(window).width());


                // Play animations
                iframe.find('[data-rule="animation-name"]').each(function(i){

                    var data = $(this).html().replace(/\/\*(.*?)\*\//g, "");

                    // Variables
                    var selector = data.split("{")[0];

                    // Get Selector
                    if(selector.indexOf("@media") != -1){
                        selector = data.split("{")[1].split("{")[0];
                    }

                    selector = selector.replace(".yp_hover","").replace(".yp_focus","").replace(".yp_click","").replace(".yp_onscreen","");

                    iframe.find(selector).each(function(){
                        $(this).addClass("yp_hover yp_focus yp_click yp_onscreen");
                    });

                });

                // Counter
                //yp-counter-min
                //yp-counter-second
                //yp-counter-ms
                var min = 0;
                window.animMinC = setInterval(function(){

                   // min
                   min = min+1;if(ms == 59){ms = 0;}
                   
                   var result = min;
                   if(min < 10){
                   result = "0"+min;
                   }

                   $(".yp-counter-min").text(result);

                },60000);

                var second = 0;
                window.animSecC = setInterval(function(){

                   // Sc
                   second = second+1;
                   
                   var result = second;
                   if(second < 10){
                   result = "0"+second;
                   }
                   $(".yp-counter-second").text(result);

                },1000);

                var ms = 0;
                window.animMsC = setInterval(function(){

                   // Ms
                   ms = ms+1;if(ms == 99){ms = 0;}

                   var result = ms;
                   if(ms < 10){
                   result = "0"+ms;
                   }
                   $(".yp-counter-ms").text(result);

                },1);

            });

            $(".yp-anim-control-pause").on("click",function(){

                clearTimeout(window.yp_anim_player);

                $(".yp-anim-playing-border").removeClass("active");
                $(".yp-anim-control-play").removeClass("active");

                    // Pause animations
                    iframe.find('[data-rule="animation-name"]').each(function(i){

                        // Variables
                        var data = $(this).html().replace(/\/\*(.*?)\*\//g, "");
                        var array = data.split("{");
                        var selector = array[0];

                        // Get Selector
                        if(selector.indexOf("@media") != -1){
                            
                            selector = array[1].split("{")[0];
                        }

                        selector = selector.replace(".yp_hover","").replace(".yp_focus","").replace(".yp_click","").replace(".yp_onscreen","");

                    iframe.find(selector).each(function(){
                        $(this).removeClass("yp_hover yp_focus yp_click yp_onscreen");
                    });

                });

                body.removeClass("yp-animate-manager-playing yp-clean-look yp-hide-borders-now");

                //yp-counter-min
                //yp-counter-second
                //yp-counter-ms
                $(".yp-counter-min").text("00");
                $(".yp-counter-second").text("00");
                $(".yp-counter-ms").text("00");
                clearInterval(window.animMinC);
                clearInterval(window.animSecC);
                clearInterval(window.animMsC);

            });

            $(".yp-anim-control-close,.yp-visual-editor-link").on("click",function(){
                $(".animation-manager-btn").trigger("click");
            });

            $(".animation-manager-btn").on("click",function(){

                 body.toggleClass("yp-animate-manager-active");
                 $(".yp-animate-manager").toggle();
                 $(".yp-anim-control-pause").trigger("click");
                 if(!$(this).hasClass("active")){

                    animation_manager();

                    // Find largest line for play/stop.
                    var maxWidth = Math.max.apply( null, $( '.yp-anim-process-inner' ).map( function (){
                        return $( this ).outerWidth( true );
                    }).get() );

                    // Always add +$(window).width() to animate bar width on start.
                    $(".yp-anim-process-bar-area").width(maxWidth+$(window).width());

                 }

                if($(".animation-option.active").length > 0){
                    $(".animation-option.active h3").trigger("click");
                    $(".animation-option.active").removeAttr("data-loaded");
                }

                insert_default_options();

            });

            $(document).on("mouseenter", ".yp-control-trash", function() {
                $(this).parent().tooltip('hide');
            });

            $(document).on("click", ".yp-control-trash", function() {

                var that = $(this);

                swal({
                  title: "You are sure?",
                  showCancelButton: true,
                  confirmButtonText: "Delete Animate",
                  closeOnConfirm: true,
                  animation: false
                },function(){

                    that.parent(".yp-anim-process-bar").prev(".yp-anim-process-bar-delay").remove();
                    that.parent(".yp-anim-process-bar").remove();

                    body.addClass("yp-anim-removing");

                        update_animation_manager();

                        $(".yp-delay-zero").each(function(){

                            var allLeft = $(".yp-anim-process-inner").offset().left-5;
                            var left = $(this).next(".yp-anim-process-bar").offset().left-allLeft;
                            $(this).css("left",left);

                            $(this).next(".yp-anim-process-bar").addClass("yp-anim-has-zero-delay");

                        });

                    body.removeClass("yp-anim-removing");
                    
                    animation_manager();

                });

            });

    
            /* ---------------------------------------------------- */
            /* get selected element object                          */
            /* ---------------------------------------------------- */
            function get_selected_element(){

                return iframe.find(".yp-selected");

            }

            /* ---------------------------------------------------- */
            /* check if content selected                            */
            /* ---------------------------------------------------- */
            function is_content_selected(){

                return mainBody.hasClass("yp-content-selected");

            }

            function is_html_mod(){
                return mainBody.hasClass("yp-html-mod-active");
            }

            function is_dragging(){

                return mainBody.hasClass("yp-dragging");

            }

            function is_resizing(){

                return mainBody.hasClass("yp-element-resizing");

            }


            /* ---------------------------------------------------- */
            /* Check if is anim creator mode                        */
            /* ---------------------------------------------------- */
            function is_animate_creator(){

                return mainBody.hasClass("yp-anim-creator");

            }
        

            
            /* ---------------------------------------------------- */
            /* Get the element classes (Cleaned by editor classes)  */
            /* ---------------------------------------------------- */
            function get_cleaned_classes(el,oldArray){

                var resultArray = [];

                // Element Classes
                var classes = el.attr("class");

                // Is defined?
                if(isDefined(classes)){

                    // Cleaning all Yellow Pencil classes.
                    classes = class_cleaner(classes);

                    // Clean spaces
                    classes = space_cleaner(classes);

                    // If not empty
                    if(classes.length >= 1){

                        var classesArray = get_classes_array(classes);

                        // Be sure there have more class then one.
                        if(classesArray.length > 0){

                            // Each
                            for(var io = 0;io < classesArray.length; io++){

                                // Clean spaces
                                var that = space_cleaner(classesArray[io]);

                                // continue If not have this class in data
                                if(resultArray.indexOf(that) == -1 && oldArray.indexOf(that) == -1 && that.length >= 1){

                                    // Push.
                                    resultArray.push(that);

                                }

                            }

                        }else{

                            // continue If not have this class in data
                            if(resultArray.match(classes) == -1 && oldArray.indexOf(classes) == -1){

                                // Push
                                resultArray.push(classes);

                            } // If

                        } // else

                    } // not empty.

                } // IsDefined

                // return.
                return resultArray;

            }

    
            /* ---------------------------------------------------- */
            /* Updating Design information section                  */
            /* ---------------------------------------------------- */
            function update_design_information(type){


                // Was wireframe?
                var washaveWireFrame = false;


                // Check wireframe
                if(body.hasClass("yp-wireframe-mode")){
                    washaveWireFrame = true;
                    body.removeClass("yp-wireframe-mode");
                }


                // Cache elements
                var elementMain = $(".info-element-general"),
                elementClasseslist = $(".info-element-class-list"),
                elementSelectorList = $(".info-element-selector-list");


                // Clean Old data
                $(".info-element-general,.info-element-class-list,.info-element-selector-list").empty();


                // Updating Section.
                if(type != 'element'){


                    // Delete Old
                    $(".info-color-scheme-list,.info-font-family-list,.info-animation-list,.info-basic-typography-list,.info-basic-size-list").empty();


                    // Get elements as variable.
                    var colorlist = $(".info-color-scheme-list"),
                    familylist = $(".info-font-family-list"),
                    animatelist = $(".info-animation-list"),
                    sizelist = $(".info-basic-size-list"),
                    typographyList = $(".info-basic-typography-list"),
                    globalclasslist = $(".info-global-class-list"),
                    globalidlist = $(".info-global-id-list");


                    // Variables
                    var maxWidth = 0,
                    maxWidthEl = null,
                    k = $(window).width();


                    // Append general elements
                    iframeBody.append("<h1 id='yp-heading-test-level-1'></h1><h2 id='yp-heading-test-level-2'></h2><h3 id='yp-heading-test-level-3'></h3><h4 id='yp-heading-test-level-4'></h4><h5 id='yp-heading-test-level-5'></h5><h6 id='yp-heading-test-level-6'></h6><h6 id='yp-paragraph-test'></h6>");


                    // Font Sizes
                    var paragraphElement = iframeBody.find("#yp-paragraph-test"),
                    bodyFontSize = (Math.round( parseFloat( iframeBody.css("fontSize") ) * 10 ) / 10),
                    paragraphFontSize = (Math.round( parseFloat( paragraphElement.css("fontSize") ) * 10 ) / 10);


                    // Font family
                    var bodyFamily = iframeBody.css("fontFamily");
                    var paragraphFamily = paragraphElement.css("fontFamily");


                    // Update typography information
                    typographyList
                    .append('<li><span class="typo-list-left">General (body)</span><span class="typo-list-right"><span>'+bodyFontSize+'px, '+get_font_name(bodyFamily)+'</span></span></li>')
                    .append('<li><span class="typo-list-left">Paragraph</span><span class="typo-list-right"><span>'+paragraphFontSize+'px, '+get_font_name(paragraphFamily)+'</span></span></li>');


                    // Delete created element. (Created only for test)
                    paragraphElement.remove();


                    // Update Heading tags. h1 > h6
                    for(var i = 1; i <= 6; i++){
                        var el = iframeBody.find("#yp-heading-test-level-"+i);
                        var size = parseFloat(el.css("fontSize"));
                        size = Math.round( size * 10 ) / 10;
                        var family = el.css("fontFamily");
                        typographyList.append('<li><span class="typo-list-left">Heading Level '+i+'</span><span class="typo-list-right"><span>'+size+'px, '+get_font_name(family)+'</span></span></li>');
                        el.remove();
                    }


                    // Each all elements for find what we need.
                    var ColoredEl = [];
                    var familyArray = [];
                    var animatedArray = [];
                    var classArray = [];
                    var idArray = [];
                    var boxSizingArray = [];

                    // Each
                    iframeBody.find(get_all_elements()).each(function(i){


                        // Element
                        var el = $(this);


                        // Find container
                        var otherWidth = el.outerWidth();

                        // 720 768 940 960 980 1030 1040 1170 1210 1268
                        if(otherWidth >= 720 && otherWidth <= 1268 && otherWidth < (k-80)){
                            if(otherWidth > maxWidth){
                                maxWidthEl = el;
                            }

                            // MaxWidth Element Founded. (Container)
                            maxWidth = Math.max(otherWidth, maxWidth);

                        }


                        // Filter font family elements.
                        var family = get_font_name(el.css("fontFamily"));
                        if(familyArray.indexOf(family) == -1){
                            familyArray.push(family);
                        }


                        // Filter colored elements.
                        var color = el.css("backgroundColor").toLowerCase().replace(/ /g,"");
                        if(color != 'transparent' && color != 'rgb(255,255,255)' && color != 'rgba(0,0,0,0)' && color != 'rgba(255,255,255,0)'){
                            ColoredEl.push(this);
                        }


                        // Get box sizing
                        if(i < 20){ // Get only on first 20 elements. no need to more.
                            var boxSizing = (el.css("boxSizing"));
                            if(isDefined(boxSizing)){

                                boxSizing  = $.trim(boxSizing);

                                if(boxSizingArray.indexOf(boxSizing) == -1){
                                    boxSizingArray.push(boxSizing);
                                }

                            }
                        }


                        // Find classes and ids
                        setTimeout(function(){

                            // If there not have any class in our list
                            if(globalclasslist.find("li").length === 0){

                                // Get Cleaned classes.
                                var arrayClassAll = get_cleaned_classes(el,classArray);

                                // Concat if not empty.
                                if(arrayClassAll.length > 0){
                                    classArray = classArray.concat(arrayClassAll);
                                }

                            }


                            // Get ID
                            // If there not have any id in our list.
                            if(globalidlist.find("li").length === 0){

                                // Get Id
                                var id = el.attr("id");

                                // is defined
                                if(isDefined(id)){

                                    // continue If not have this class in data
                                    if(idArray.indexOf(id) == -1){

                                        // Push
                                        idArray.push(id);

                                    }

                                }

                            }


                        },500);

                    });

    
                    // Filter animated elements.
                    iframe.find(".yp-styles-area [data-rule='animation-name']").each(function(){

                        var animate = escape_data_value($(this).html());

                        if(animatedArray.indexOf(animate) == -1){
                            animatedArray.push(animate);
                        }

                    });


                    // Not adding on responsive mode.
                    var containerWidth;
                    if(mainBody.hasClass("yp-responsive-device-mode") === false){

                        containerWidth = maxWidth+'px';

                    }else{
                        containerWidth = 'Unknown';
                    }

        
                    // Apply colors
                    $(ColoredEl).each(function(){

                        var el = $(this);
                        var color = el.css("backgroundColor").toLowerCase().replace(/ /g,"");

                        var current = $(".info-color-scheme-list div[data-color='"+color+"']");
                        var ratio = parseFloat(100/$(ColoredEl).length);

                        if(current.length > 0){
                            var cWi = parseFloat(current.attr("data-width"));
                            current.css("width",(cWi+ratio)+"%");
                            current.attr("data-width",(cWi+ratio));
                        }else{
                            colorlist.append('<div data-width="'+ratio+'" data-color="'+color+'" style="width:'+ratio+'%;background-color:'+color+';"></div>');
                        }

                    });


                    // Update fonts
                    $.each(familyArray,function(i,v){
                        familylist.append("<li>"+v+"</li>");
                    });


                    // Update animations.
                    $.each(animatedArray,function(i,v){
                        animatelist.append("<li>"+v+"</li>");
                    });


                    // Append Size information to size section.
                    sizelist.append('<li><span class="typo-list-left">Box Sizing</span><span class="typo-list-right"><span>'+boxSizingArray.toString()+'</span></span></li>')
                    .append('<li><span class="typo-list-left">Container Width</span><span class="typo-list-right"><span>'+containerWidth+'</span></span></li>')
                    .append('<li><span class="typo-list-left">Document Width</span><span class="typo-list-right"><span>'+(parseInt(iframe.width())+window.leftbarWidth)+'px</span></span></li>')
                    .append('<li><span class="typo-list-left">Document Height</span><span class="typo-list-right"><span>'+iframe.height()+'px</span></span></li>');


                    // waiting a litte for high performance.
                    setTimeout(function(){

                        // Append classes
                        $.each(classArray,function(i,v){
                            globalclasslist.append("<li>."+v+"</li>");
                        });

                        // Append ids
                        $.each(idArray,function(i,v){
                            globalidlist.append("<li>#"+v+"</li>");
                        });

                    },1000);


                }


                // if is element Section
                if(is_content_selected()){


                    // Hide and show some sections in design information
                    $(".info-no-element-selected").hide();
                    $(".info-element-selected-section").show();
                    $("info-element-selector-section").hide();


                    // cache selected element
                    var selectedEl = get_selected_element();
                    var selectedID = selectedEl.attr("id");


                    // Getting element ID.
                    if(isDefined(selectedID)){

                        // Is valid?
                        if(selectedID !== ''){

                            // Append
                            elementMain.append('<li><span class="typo-list-left">Element ID</span><span class="typo-list-right"><span>#'+selectedID+'</span></span></li>');

                        }

                    }


                    // Append Tag name
                    elementMain.append('<li><span class="typo-list-left">Tag</span><span class="typo-list-right"><span>'+selectedEl[0].nodeName+'</span></span></li>');


                    // Append Affected count
                    elementMain.append('<li><span class="typo-list-left">Affected elements</span><span class="typo-list-right"><span>'+(parseInt(iframeBody.find(".yp-selected-others").length)+1)+'</span></span></li>');


                    // Get class Array
                    var classSelfArray = get_cleaned_classes(selectedEl,[]);

                    var x;

                    // Append all classes.
                    for(x = 0; x < classSelfArray.length; x++){

                        // Append
                        elementClasseslist.append("<li>."+classSelfArray[x]+"</li>");

                    }


                    // Hide class section if empty.
                    if(elementClasseslist.find("li").length === 0){
                        $(".info-element-classes-section").hide();
                    }else{
                        $(".info-element-classes-section").show();
                    }


                    // Current Selector
                    elementSelectorList.append('<li>'+get_current_selector()+'</li>');


                    // Create dom data. For show DOM HTML in Design information tool
                    var clone = selectedEl.clone();


                    // Clean basic position relative style from clone
                    if(isDefined(clone.attr("style"))){

                        // Trim Style
                        var trimCloneStyle = clone.attr("style").replace(/position:(\s*?)relative(\;?)|animation-fill-mode:(\s*?)(both|forwards|backwards|none)(\;?)/g,"");

                        // Remove Style Attr if is empty.
                        if(trimCloneStyle == ''){
                            clone.removeAttr("style");
                        }else{
                            clone.attr("style",trimCloneStyle);
                        }

                    }

                    // Remove Class Attr.
                    clone.removeAttr("class");


                    // Just add valid classes.
                    for(x = 0; x < classSelfArray.length; x++){

                        // addClass.
                        clone.addClass(classSelfArray[x]);

                    }

                    // Dom Content.
                    clone.html("...");

                    // Get.
                    var str = $("<div />").append(clone).html();

                    // Set
                    $(".info-element-dom").val(str);


                // Show there no element selected section.
                }else{

                    $(".info-no-element-selected").show();

                    $(".info-element-selected-section").hide();

                }

                // Active wireframe if was active before open.
                // Notice: This function close wireframe for getting colors and details of the elements.
                if(washaveWireFrame === true){
                    body.addClass("yp-wireframe-mode");
                }

            }


            // lock options values.
            $(".lock-btn").on("click",function(){

                // Toggle active
                $(this).toggleClass("active");

            });


            function get_font_name(family){

                if(family.indexOf(",") != -1){
                    family = family.split(",")[0];
                }

                family = $.trim(family).replace(/\W+/g, " ");

                return family;

            }

            $(".advanced-close-link").on("click",function(){
                $(".advanced-info-box").hide();
                $(".info-btn").removeClass("active");
            });

            $(".info-btn").on("click",function(){

                if(!$(this).hasClass("active")){
                    $(".element-btn").trigger("click");
                    var max = $(window).height()-$(this).offset().top;
                    $(".advanced-info-box").css({"top":$(this).offset().top,"max-height": max});
                    update_design_information('all');
                }

                $(".advanced-info-box").toggle();

            });

            $(".typography-btn").on("click",function(){
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
                $(".typography-content,.element-content,.advanced-content").hide();
                $(".typography-content").show();
            });

            $(".element-btn").on("click",function(){
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
                $(".element-content,.typography-content,.advanced-content").hide();
                $(".element-content").show();
            });

            $(".advanced-btn").on("click",function(){
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
                $(".element-content,.typography-content,.advanced-content").hide();
                $(".advanced-content").show();
            });

            $(".advance-info-btns").on("click",function(){
                $(".advanced-info-box-inner").scrollTop(0);
            });


            // Get all Animated Elements
            function animation_manager(){

                $(".yp-animate-manager [data-toggle='tooltipAnim']").tooltip("destroy");
                $(".yp-anim-process-bar-delay,.yp-anim-process-bar").resizable('destroy');
                $(".yp-anim-el-column,.yp-animate-bar").remove();

                // Update metric
                $(".yp-anim-metric").empty();
                for(var i = 1; i < 61; i++){
                    $(".yp-anim-metric").append('<div class="second"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><b>'+i+'s</b></div>');
                }

                iframe.find('[data-rule="animation-name"]').each(function(iX){

                    // Variables
                    var data = $(this).html().replace(/\/\*(.*?)\*\//g, "");
                    var device = $(this).attr("data-size-mode");
                    var array = data.split("{");
                    var selector = array[0];
                    var animateName = escape_data_value(data);
                    var animateDelayOr = "0s";
                    var animateTimeOr = "1s";
                    var mode = 'yp_onscreen';

                    if(animateName == 'none'){
                        return true;
                    }

                    if(selector.indexOf("yp_hover") != -1){
                        mode = 'yp_hover';
                    }else if(selector.indexOf("yp_focus") != -1){
                        mode = 'yp_focus';
                    }else if(selector.indexOf("yp_click") != -1){
                        mode = 'yp_click';
                    }else if(selector.indexOf("yp_onscreen") != -1){
                        mode = 'yp_onscreen';
                    }

                    var deviceName =  '';
                    var deviceHTML = '';
                    var modeName = mode.replace("yp_","");

                    // Get Selector
                    if(selector.indexOf("@media") != -1){
                        device = $.trim(selector.replace("@media",""));
                        selector = array[1].split("{")[0];
                    }

                    if(device != 'desktop'){
                        deviceName = 'Responsive';
                    }

                    if(deviceName !== ''){
                        deviceHTML = " <label data-toggle='tooltipAnim' data-placement='right' title='This animation will only play on specific screen sizes.' class='yp-device-responsive'>"+deviceName+"</label><span class='yp-anim-media-details'>"+device+"</span>";
                    }

                    // Clean Selector
                    var selectorClean = selector.replace(".yp_hover","").replace(".yp_focus","").replace(".yp_click","").replace(".yp_onscreen","");

                    // Get Element Name
                    var elementName = 'Undefined';
                    if(iframe.find(selectorClean).length > 0){
                        elementName = removeDiacritics(uppercase_first_letter(get_tag_information(selectorClean)).replace(/\d+/g, ''));
                    }

                    // Element Variables
                    if(iframe.find("."+get_id(selector)+"-animation-duration-style[data-size-mode='"+device+"']").length > 0){
                        animateTimeOr = iframe.find("."+get_id(selector)+"-animation-duration-style[data-size-mode='"+device+"']").html();
                        animateTimeOr = escape_data_value(animateTimeOr);
                    }

                    if(iframe.find("."+get_id(selector)+"-animation-delay-style[data-size-mode='"+device+"']").length > 0){
                        animateDelayOr = iframe.find("."+get_id(selector)+"-animation-delay-style[data-size-mode='"+device+"']").html();
                        animateDelayOr = escape_data_value(animateDelayOr);
                    }

                    var animateTime = $.trim(animateTimeOr.replace('/[^0-9\.]+/g','').replace(/ms/g,"").replace(/s/g,""));
                    var animateDelay = $.trim(animateDelayOr.replace('/[^0-9\.]+/g','').replace(/ms/g,"").replace(/s/g,""));

                    if(animateName.indexOf(",") == -1){

                        animateTime = animateTime * 100;
                        animateDelay = animateDelay * 100;

                        if(animateDelay < 10){
                            animateDelay = 10;
                        }

                    }

                    var extraClass = '';
                    if(animateDelay == 10){
                        extraClass = ' yp-delay-zero';
                    }
                    
                    var animateContent = "<div class='yp-anim-process-bar-delay"+extraClass+"' data-toggle='tooltipAnim' data-placement='top' title='Delay "+parseFloat(animateDelayOr).toFixed(2)+"s' style='width:"+animateDelay+"px;'></div><div class='yp-anim-process-bar' data-toggle='tooltipAnim' data-placement='top' title='Duration: "+parseFloat(animateTimeOr).toFixed(2)+"s' style='width:"+animateTime+"px;'><span class='animate-part-icons yp-control-trash' data-toggle='tooltipAnim' data-placement='top' title='Delete'><span class='dashicons dashicons-trash'></span></span>"+animateName+"</div>";


                    var childAnimateDelayOr,childAnimateDelay,childAnimateTimeOr,childAnimateTime;
                    if(animateName.indexOf(",") != -1){

                        animateContent = '';

                        var prevsBeforeAppend = 0;

                        for(var i = 0; i < animateName.split(",").length; i++){

                            if(animateDelayOr.toString().indexOf(",") != -1){
                                childAnimateDelayOr = $.trim(animateDelayOr.split(",")[i]);
                            }else{
                                childAnimateDelayOr = animateDelayOr;
                            }

                            // default is 1s for child animate delay Or.
                            if(isUndefined(childAnimateDelayOr)){
                                childAnimateDelayOr = "0s";
                            }

                            if(animateDelay.toString().indexOf(",") != -1){
                                childAnimateDelay = $.trim(animateDelay.split(",")[i]);
                            }else{
                                childAnimateDelay = animateDelay;
                            }

                            // default is 1s for child animate delay.
                            if(isUndefined(childAnimateDelay)){
                                childAnimateDelay = 0;
                            }

                            if(animateTimeOr.toString().indexOf(",") != -1){
                                childAnimateTimeOr = $.trim(animateTimeOr.split(",")[i]);
                            }else{
                                childAnimateTimeOr = animateTimeOr;
                            }

                            // default is 1s for child animate time Or.
                            if(isUndefined(childAnimateTimeOr)){
                                childAnimateTimeOr = "1s";
                            }


                            if(animateTime.toString().indexOf(",") != -1){
                                childAnimateTime = $.trim(animateTime.split(",")[i]);
                            }else{
                                childAnimateTime = animateTime;
                            }

                            // default is 1s for child animate.
                            if(isUndefined(childAnimateTime)){
                                childAnimateTime = 1;
                            }

                            var childAnimate = $.trim(animateName.split(",")[i].replace(/\s+?!important/g,'').replace(/\;$/g,''));

                            childAnimateTime = childAnimateTime * 100;
                            childAnimateDelay = childAnimateDelay * 100;

                            if(childAnimateDelay < 10){
                                childAnimateDelay = 10;
                            }
                            
                            var SmartDelayView = (childAnimateDelay-prevsBeforeAppend);
                            var smartDelayOrView = SmartDelayView/100;
                            if(SmartDelayView <= 10){
                                SmartDelayView = 10;
                                smartDelayOrView = "0s";
                            }

                            extraClass = '';
                            if(SmartDelayView == 10){
                                extraClass = ' yp-delay-zero';
                            }

                            animateContent += "<div class='yp-anim-process-bar-delay"+extraClass+"' data-toggle='tooltipAnim' data-placement='top' title='Delay "+parseFloat(smartDelayOrView).toFixed(2)+"s' style='width:"+SmartDelayView+"px;'></div><div class='yp-anim-process-bar' data-toggle='tooltipAnim' data-placement='top' title='Duration: "+parseFloat(childAnimateTimeOr).toFixed(2)+"s' style='width:"+childAnimateTime+"px;'><span class='animate-part-icons yp-control-trash' data-toggle='tooltipAnim' data-placement='top' title='Delete'><span class='dashicons dashicons-trash'></span></span>"+childAnimate+"</div>";

                            prevsBeforeAppend = childAnimateDelay+childAnimateTime;

                        }

                    }

                    // Append.
                    $(".yp-anim-left-part-column").append("<div class='yp-anim-el-column yp-anim-el-column-"+get_id(selectorClean)+"' data-anim-media-size='"+device+"'><span data-toggle='tooltipAnim' data-placement='right' title='"+selectorClean+"'>"+elementName+"</span> <label>"+modeName+"</label>"+deviceHTML+"</div>");

                    $(".yp-anim-right-part-column").append("<div class='yp-animate-bar' id='yp-animate-bar-"+iX+"'><div class='yp-anim-process-bar-area' data-responsive='"+device+"' data-selector='"+selectorClean+"' data-selector-full='"+selector+"'><div class='yp-anim-process-inner'>"+animateContent+"</div><a class='yp-anim-add' data-toggle='tooltipAnim' data-placement='right' title='Add New Animate'></a></div>");

                });
    
                $(".yp-delay-zero").each(function(){

                        var allLeft = $(".yp-anim-process-inner").offset().left-5;
                        var left = $(this).next(".yp-anim-process-bar").offset().left-allLeft;
                        $(this).css("left",left);

                        $(this).next(".yp-anim-process-bar").addClass("yp-anim-has-zero-delay");

                    });

                // Get current selector
                var Cselector = get_current_selector();
                var Lineway = $(".yp-anim-el-column-"+get_id(Cselector)+"[data-anim-media-size='"+get_current_media_query()+"']");

                // has selected element and there not have same element in manager list
                if(isDefined(Cselector) && Lineway.length === 0){

                    // Get Element Name
                    var elementName = 'Undefined';
                    if(iframe.find(Cselector).length > 0){
                        elementName = removeDiacritics(uppercase_first_letter(get_tag_information(Cselector)).replace(/\d+/g, ''));
                    }

                    var deviceHTML = '';

                    if(get_current_media_query() != 'desktop'){
                    deviceHTML = " <label data-toggle='tooltipAnim' data-placement='right' title='This animation will only play on specific screen sizes.' class='yp-device-responsive'>Responsive</label><span class='yp-anim-media-details'>"+get_current_media_query()+"</span>";
                    }

                    // Bar
                    $(".yp-anim-left-part-column").append("<div class='yp-anim-el-column anim-active-row yp-anim-el-column-"+get_id(Cselector)+"' data-anim-media-size='"+get_current_media_query()+"'><span data-toggle='tooltipAnim' data-placement='right' title='"+Cselector+"'>"+elementName+"</span> <label>onscreen</label>"+deviceHTML+"</div>");

                    // Adding
                    $(".yp-anim-right-part-column").append("<div class='yp-animate-bar anim-active-row' id='yp-animate-bar-current'><div class='yp-anim-process-bar-area' data-responsive='"+get_current_media_query()+"' data-selector='"+Cselector+"' data-selector-full='"+(Cselector+".yp_onscreen")+"'><div class='yp-anim-process-inner'></div><a class='yp-anim-add' data-toggle='tooltipAnim' data-placement='right' title='Add New Animate'></a></div>");

                }else{
                    Lineway.addClass("anim-active-row");
                }

                // resizable
                $( ".yp-anim-process-bar-delay,.yp-anim-process-bar" ).resizable({
                    handles: 'e',
                    minWidth: 10,
                    start: function() {

                        $(".yp-anim-process-bar-delay,.yp-anim-process-bar").not(this).tooltip("disable").tooltip("hide");

                    },
                    resize: function( event, ui ) {

                        var that = $(this);
                        var w = ui.size.width;
                        var s = parseFloat(w/100).toFixed(2);

                        var newTitle;
                        if(that.hasClass("yp-anim-process-bar-delay")){

                            if(w == 10){
                                s = "0";
                            }
                            newTitle = "Delay: "+s;

                            // Delay zero
                            if(w <= 10){
                                that.addClass("yp-delay-zero");
                            }

                            // clean delay zero
                            if(that.hasClass("yp-delay-zero")){
                                that.removeClass("yp-delay-zero").css("left","0");
                            }

                        }else{

                            newTitle = "Duration: "+s;

                            if(that.prev(".yp-anim-process-bar-delay").hasClass("yp-delay-zero")){
                                that.addClass("yp-anim-has-zero-delay");
                            }else if(that.hasClass("yp-anim-has-zero-delay")){
                                that.removeClass("yp-anim-has-zero-delay");
                            }

                        }


                        $(this).parents(".yp-animate-bar").find(".yp-delay-zero").each(function(){

                            var allLeft = $(".yp-anim-process-inner").offset().left-5;
                            var left = $(this).next(".yp-anim-process-bar").offset().left-allLeft;
                            $(this).css("left",left);

                        });
                            

                        that.attr('data-original-title', newTitle+"s").tooltip('show');

                    },
                    stop: function() {

                        update_animation_manager();
                        $(".yp-anim-process-bar-delay,.yp-anim-process-bar").tooltip("enable");

                    }

                });


                $('[data-toggle="tooltipAnim"]').tooltip({
                    animation: false,
                    container: ".yp-animate-manager",
                    html: true
                });

                $("[data-toggle='tooltipAnim']").on('show.bs.tooltip', function(){
                    $("[data-toggle='tooltipAnim']").not(this).tooltip("hide");
                });

                if($(".yp-animate-bar").length === 0){
                    $(".animation-manager-empty").show();
                }else{
                    $(".animation-manager-empty").hide();
                }

            }


            function update_animation_manager(){

                body.addClass("yp-animate-manager-mode");

                // Find largest line for play/stop.
                var maxWidth = Math.max.apply( null, $( '.yp-anim-process-inner' ).map( function (){
                    return $( this ).outerWidth( true );
                }).get() );

                // Always add more px to animate bar width on update.
                $(".yp-anim-process-bar-area").width(maxWidth+$(window).width());

                // Each all lines
                $(".yp-animate-bar").each(function(){

                    // Get selector with mode.
                    var selector = $(this).find(".yp-anim-process-bar-area").attr("data-selector-full");

                    // Animate name array.
                    var sMultiNames = [];

                    // Find all delays in this line.
                    var sMulti = [];
                    var sMultiDuration = [];

                    // delay
                    var delay = 0;
                    var offets = '';

                    // Get size
                    var size = $(this).find(".yp-anim-process-bar-area").attr("data-responsive");
                    if(size == ''){
                        size = 'desktop';
                    }

                    // Each all animate bars
                    $(this).find(".yp-anim-process-bar,.yp-anim-process-bar-delay").each(function(){

                        // Get width.
                        var w = $(this).width();

                        // Width to Second.
                        var s = w/100;

                        // If delay and its not a multiable line.
                        if($(this).hasClass("yp-anim-process-bar-delay") && $(this).parent().find(".yp-anim-process-bar-delay").length == 1){

                            if(w == 10){
                                s = "0";
                            }

                            // Update one delay.
                            insert_rule(selector, "animation-delay", Math.round(s * 100) / 100, 's', size);

                        // If animate bar and not a multiable line.
                        }else if($(this).hasClass("yp-anim-process-bar") && $(this).parent().find(".yp-anim-process-bar").length == 1){

                            // Update one duration.
                            insert_rule(selector, "animation-duration", s, 's', size);
                            insert_rule(selector, "animation-name", $(this).text(), '', size);
                            sMultiNames.push($(this).text());

                        // If multi line and its delay or animate bar.
                        }else if($(this).parent().find(".yp-anim-process-bar-delay").length > 1 || $(this).parent().find(".yp-anim-process-bar").length > 1){

                            // Delay.. Multi..
                            if($(this).hasClass("yp-anim-process-bar-delay")){

                                offets = $(this).offset().left-$(this).parent(".yp-anim-process-inner").offset().left;
                                offets = offets/100;
                                offets = Math.round(offets * 100) / 100;

                                if($(this).width() > 10){

                                    delay = $(this).width()/100;
                                    delay = Math.round(delay * 100) / 100;
                                    sMulti.push(delay+offets+"s");

                                }else{

                                    sMulti.push(offets+"s");

                                }
                                
                            }

                            // Duration.. Multi..
                            if($(this).hasClass("yp-anim-process-bar")){

                                var xy = $(this).width()/100;

                                sMultiDuration.push(xy+"s");
                                sMultiNames.push($(this).text());
                                
                            }

                        }

                    });

                    // Insert multi delays.
                    if(sMulti.length > 1){
                        insert_rule(selector, "animation-delay", sMulti.toString(), '', size);
                        insert_rule(selector, "animation-duration", sMultiDuration.toString(), '', size);
                        insert_rule(selector, "animation-name", sMultiNames.toString(), '', size);

                    }else if(sMultiNames.length === 0 && body.hasClass("yp-anim-removing")){
                        insert_rule(selector, "animation-delay", "disable", '', size);
                        insert_rule(selector, "animation-duration", "disable", '', size);
                        insert_rule(selector, "animation-name", "disable", '', size);
                    }

                    option_change();

                });

                body.removeClass("yp-animate-manager-mode");

            }

            $(window).click(function() {
                
                if($(".yp-anim-list-menu").is(":visible")){
                    $(".yp-anim-list-menu").hide();
                }

            });

            $(document).on("click", ".yp-anim-list-menu ul li", function(e) {

                // Clean old.
                get_selected_element().removeClass("yp_onscreen yp_hover yp_click yp_focus");

                var p = $(".yp-anim-add.active");

                mainBody.addClass("yp-animate-manager-mode");
                var selector = p.parent().attr("data-selector-full");
                var allAnimNames = [];
                var allDurations = [];
                var allDelays = [];

                // Get size
                var size = p.parents(".yp-anim-process-bar-area").attr("data-responsive");
                if(size == ''){
                    size = 'desktop';
                }

                // If empty, so this new.
                if(p.parent().find(".yp-anim-process-inner").is(':empty')){
                    insert_rule(selector, "animation-name", $(this).data("value"), '',size);
                }else{

                    // push older animations
                    p.parent().find(".yp-anim-process-inner .yp-anim-process-bar").each(function(){
                        allAnimNames.push($(this).text());
                        allDurations.push(($(this).width()/100)+"s");
                    });

                    // push older animations
                    p.parent().find(".yp-anim-process-inner .yp-anim-process-bar-delay").each(function(){
                        var offets = ($(this).offset().left-p.parent().find(".yp-anim-process-inner").offset().left)/100;
                        allDelays.push(offets+($(this).width()/100)+"s");
                    });

                    // push new animation too
                    allAnimNames.push($(this).data("value"));
                    allDurations.push("1s");

                    var lastAnim = p.parent().find(".yp-anim-process-inner .yp-anim-process-bar").last();
                    var offets = ((lastAnim.offset().left+lastAnim.width())-p.parent().find(".yp-anim-process-inner").offset().left)/100;
                    allDelays.push(offets+"s");

                    insert_rule(selector, "animation-name",allAnimNames.toString(), '',size);
                    insert_rule(selector, "animation-duration",allDurations.toString(), '',size);
                    insert_rule(selector, "animation-delay",allDelays.toString(), '',size);

                }

                mainBody.removeClass("yp-animate-manager-mode");

                setTimeout(function(){
                    animation_manager();
                    update_animation_manager();
                },100);

            });

            $(document).on("click", ".yp-anim-add", function(e) {

                e.stopPropagation();
                var t = $(this).offset().top;
                var l = $(this).offset().left;

                var menu = $(".yp-anim-list-menu ul");
                $(".yp-anim-list-menu").removeAttr("style").removeClass("yp-anim-list-top");
                menu.empty();
                $("#yp-animation-name-data option").each(function(){
                    var el = $(this);
                    if(el.text() != 'none'){
                        menu.append("<li data-value='"+el.attr("value")+"' data-text='"+el.data("text")+"'>"+el.text()+"</li>");
                    }
                });

                var d = $(window).height()-t-46;

                if(d < 150){
                    $(".yp-anim-list-menu").addClass("yp-anim-list-top");
                }else{
                    if(menu.height() > d){
                        menu.height(d);
                    }
                }

                $(".yp-anim-list-menu").css("left",l).css("top",t).show();

                $(".yp-anim-add").removeClass("active");
                $(this).addClass("active");

            });


            // Lite Version Modal Close
            $(".yp-info-modal-close").click(function() {
                $(this).parent().parent().hide();
                $(".yp-popup-background").hide();
            });

            // Background uploader Popup Close.
            $(".yp-popup-background").click(function() {
                $(this).hide();
                $(".yp-info-modal").hide();
            });

            $(".yp-selector-mode").click(function() {

                if($(".yp-ruler-btn").hasClass("active")){
                    $(".yp-ruler-btn").trigger("click");
                    $(".yp-selector-mode").trigger("click");
                }

                if ($(this).hasClass("active") && $(".yp-sharp-selector-btn.active").length > 0) {
                    $(".yp-sharp-selector-btn").removeClass("active");
                    body.removeClass("yp-sharp-selector-mode-active");
                    iframeBody.removeClass("yp-sharp-selector-mode-active");
                }
                
                body.toggleClass("yp-body-selector-mode-active");
                clean();
                element_leave();

            });

            // cache
            window.scroll_width = get_scroll_bar_width();

            function draw_responsive_handle() {

                if (mainBody.hasClass("yp-responsive-device-mode") === false) {
                    return false;
                }

                // variables
                var iframeElement = $("#iframe");

                if(isUndefined(window.FrameleftOffset)){
                    var offset = iframeElement.offset();
                    window.FrameleftOffset = offset.left;
                    window.FrametopOffset = offset.top;
                }

                var w = iframeElement.width();
                var h = iframeElement.height();

                var left = window.FrameleftOffset + w;
                var top = window.FrametopOffset + h;

                $(".responsive-right-handle").css("left", left)
                .css("top", window.FrametopOffset - 2)
                .css("height", h + 2);

                $(".responsive-bottom-handle").css("left", window.FrameleftOffset)
                .css("top", top)
                .css("width", w);

            }

            // right
            window.responsiveModeRMDown = false;
            window.SelectorDisableResizeRight = false;
            window.rulerWasActive = false;
            window.selectorWasActive = false;

            $(".responsive-right-handle").on("mousedown", function(e) {

                window.responsiveModeRMDown = true;
                body.addClass("yp-clean-look yp-responsive-resizing yp-responsive-resizing-right yp-hide-borders-now");

                if($(".yp-selector-mode").hasClass("active")){
                    window.selectorWasActive = true;
                }else{
                    window.selectorWasActive = false;
                }

                if ($(".yp-ruler-btn").hasClass("active")) {
                    window.rulerWasActive = true;
                } else {
                    window.rulerWasActive = false;
                    $(".yp-ruler-btn").trigger("click").removeClass("active");
                }

                if ($(".yp-selector-mode").hasClass("active") && is_content_selected() === false) {
                    $(".yp-selector-mode").trigger("click");

                    window.SelectorDisableResizeRight = true;
                }

            });

            mainDocument.on("mousemove", function(e) {

                if (window.responsiveModeRMDown === true) {

                    var hasClass = mainBody.hasClass("yp-css-editor-active");
                    var ww = $(window).width();

                    if (hasClass === true) {
                        e.pageX = e.pageX - 450 - 10;
                    } else {
                        e.pageX = e.pageX - window.leftbarWidth - 10;
                    }

                    // Min 320
                    if (e.pageX < 320) {
                        e.pageX = 320;
                    }

                    // Max full-80 W
                    if (hasClass) {
                        if (e.pageX > ww - 80 - 450) {
                            e.pageX = ww - 80 - 450;
                        }
                    } else {
                        if (e.pageX > ww - 80 - 49) {
                            e.pageX = ww - 80 - 49;
                        }
                    }

                    $("#iframe").width(e.pageX);

                    draw_responsive_handle();
                    update_responsive_size_notice();

                }
            });

            mainDocument.on("mouseup", function() {

                if (window.responsiveModeRMDown === true) {

                    if(body.hasClass("yp-animate-manager-active")){
                        animation_manager();
                    }

                    window.responsiveModeRMDown = false;

                    if (window.SelectorDisableResizeBottom === false) {
                        draw();
                    }

                    body.removeClass("yp-clean-look yp-responsive-resizing yp-responsive-resizing-right");

                    setTimeout(function() {
                        body.removeClass("yp-hide-borders-now");
                    }, 25);

                    if (window.SelectorDisableResizeRight === true) {
                        window.SelectorDisableResizeRight = false;
                    }

                    if (window.rulerWasActive === false) {
                        $(".yp-ruler-btn").addClass("active").trigger("click");
                    }


                    if(window.selectorWasActive === true){
                        if($(".yp-selector-mode").hasClass("active") === false){
                            $(".yp-selector-mode").trigger("click");
                        }
                    }else{
                        if($(".yp-selector-mode").hasClass("active")){
                            $(".yp-selector-mode").trigger("click");
                        }
                    }

                    // Update options
                    insert_default_options();

                    setTimeout(function() {
                        $(".reset-enable").removeClass("reset-enable");
                    }, 10);

                }

            });

            // bottom
            window.responsiveModeBMDown = false;
            window.SelectorDisableResizeBottom = false;

            $(".responsive-bottom-handle").on("mousedown", function() {
                window.responsiveModeBMDown = true;
                body.addClass("yp-clean-look yp-responsive-resizing yp-responsive-resizing-bottom yp-hide-borders-now");

                if($(".yp-selector-mode").hasClass("active")){
                    window.selectorWasActive = true;
                }else{
                    window.selectorWasActive = false;
                }

                if ($(".yp-ruler-btn").hasClass("active")) {
                    window.rulerWasActive = true;
                } else {
                    window.rulerWasActive = false;
                    $(".yp-ruler-btn").trigger("click");
                }

                if ($(".yp-selector-mode").hasClass("active") && is_content_selected() === false) {
                    $(".yp-selector-mode").trigger("click");
                    window.SelectorDisableResizeBottom = true;
                }

            });

            mainDocument.on("mousemove", function(e) {
                if (window.responsiveModeBMDown === true) {

                    var ext = 0;
                    if(mainBody.hasClass("yp-html-mod-active")){
                        ext = 42;
                    }

                    if ($(this).find("#iframe").length > 0) {
                        e.pageY = e.pageY - 41 - ext;
                    }

                    // Min 320
                    if (e.pageY < 320) {
                        e.pageY = 320;
                    }

                    // Max full-80 H
                    if (e.pageY > $(window).height() - 80 - 31 - ext) {
                        e.pageY = $(window).height() - 80 - 31 - ext;
                    }

                    $("#iframe").height(e.pageY);
                    draw_responsive_handle();

                    update_responsive_size_notice();

                }
            });

            mainDocument.on("mouseup", function() {

                if (window.responsiveModeBMDown === true) {
                    window.responsiveModeBMDown = false;

                    if (window.SelectorDisableResizeBottom === false) {
                        draw();
                    }

                    body.removeClass("yp-clean-look yp-responsive-resizing yp-responsive-resizing-bottom");

                    setTimeout(function() {
                        body.removeClass("yp-hide-borders-now");
                    }, 25);

                    if (window.SelectorDisableResizeBottom === true) {
                        $(".yp-selector-mode").trigger("click");
                        window.SelectorDisableResizeBottom = false;
                    }

                    if (window.rulerWasActive === false) {
                        $(".yp-ruler-btn").trigger("click");
                    }

                    if(window.selectorWasActive === true){
                        if($(".yp-selector-mode").hasClass("active") === false){
                            $(".yp-selector-mode").trigger("click");
                        }
                    }else{
                        if($(".yp-selector-mode").hasClass("active")){
                            $(".yp-selector-mode").trigger("click");
                        }
                    }

                    // Update options
                    insert_default_options();

                    setTimeout(function() {
                        $(".reset-enable").removeClass("reset-enable");
                    }, 10);

                }

            });

        
            var lastKeyUpAt = 0;

            // Setting Shortcuts.
            mainDocument.on("keyup", function(e) {

                lastKeyUpAt = new Date();

                // Getting current tag name.
                var tag = e.target.tagName.toLowerCase();

                // Control
                var ctrlKey = false;
                var tagType = false;
                var shifted = e.shiftKey ? true : false;

                // Check If is CTRL Key.
                if ((e.ctrlKey === true || e.metaKey === true)) {
                    ctrlKey = true;
                }

                // Stop if this target is input or textarea.
                if (tag == 'input' || tag == 'textarea') {
                    tagType = true;
                }

                // Multi selecting support
                if(ctrlKey === false && tagType === false){
                    body.removeClass("yp-control-key-down");
                    iframe.find(".yp-multiple-selected").removeClass("yp-multiple-selected");
                    iframe.find(".yp-selected-others-multiable-box").remove();
                }

            });


            // Setting Shortcuts.
            mainDocument.on("keydown", function(e) {

                // get current time
                var keyDownAt = new Date();

                // Getting current tag name.
                var tag = e.target.tagName.toLowerCase();

                // Getting Keycode.
                var code = e.keyCode || e.which;

                // Control
                var ctrlKey = false;
                var shifted = e.shiftKey ? true : false;
                var tagType = false;
                var selector;

                // Check If is CTRL Key.
                if ((e.ctrlKey === true || e.metaKey === true)){
                    ctrlKey = true;
                }

                // Stop if this target is input or textarea.
                if (tag == 'input' || tag == 'textarea') {
                    tagType = true;
                }

                // Hide. delete
                if (code == 46 && ctrlKey === false && tagType === false) {
                    insert_rule(null, "display", "none", '');
                    option_change();
                    clean();
                    element_leave();
                    gui_update();
                }

                // ESC for custom selector.
                if (code == 27 && ctrlKey === false) {

                    // Was resizing?
                    if(is_resizing()){
                        return false;
                    }

                    if($(".sweet-alert").css("display") == 'none' || $(".sweet-alert").length === 0){

                        if($(".yp-popup-background").css("display") != 'none'){
                            $(".yp-info-modal-close").trigger("click");
                            return false;
                        }

                        if ($(".yp-button-target.active").length <= 0) {
                            $("#yp-button-target-input").val("");
                            $(".yp-button-target").trigger("click");
                            return false;
                        }

                    }

                }

                if(ctrlKey === false && tagType === false && shifted === true){

                    setTimeout(function() {

                        // Compare key down time with key up time
                        if (+keyDownAt > +lastKeyUpAt && is_content_selected()){
                            
                            body.addClass("yp-control-key-down");

                            var recentElement = iframe.find(".yp-recent-hover-element");

                            if(recentElement.length > 0){
                                recentElement.trigger("mouseover");
                            }

                        }

                    }, 220);

                }


                // UP DOWN keys for move selected element
                if (ctrlKey === false && tagType === false){
                    if(code == 38 || code == 40 || code == 37 || code == 39){
                        if(is_content_selected() && is_dragging() === false){
                            e.preventDefault();

                            var el = get_selected_element();
                            var t = parseInt(el.css("top"));
                            var l = parseInt(el.css("left"));
                            var r = parseInt(el.css("right"));
                            var b = parseInt(el.css("bottom"));
                            var f = 1;

                            if(shifted){
                                f = 10;
                            }

                            if(code == 38){
                                t = t-f;
                            }else if(code == 40){
                                t = t+f;
                            }

                            if(code == 37){
                                l = l-f;
                            }else if(code == 39){
                                l = l+f;
                            }

                            t = t+"px";
                            l = l+"px";

                            // Insert new data. TOP BOTTOM
                            if(code == 38 || code == 40){

                                insert_rule(null, "top", t, '');

                                if (parseFloat(t) + parseFloat(b) !== 0) {
                                    insert_rule(null, "bottom", "auto", '');
                                }
                            
                            }

                            // Insert new data. LEFT RIGHT
                            if(code == 37 || code == 39){

                                insert_rule(null, "left", l, '');

                                if (parseFloat(l) + parseFloat(r) !== 0) {
                                    insert_rule(null, "right", "auto", '');
                                }

                            }

                            var position = el.css("position");

                            if(position == 'static' || position == 'relative'){
                                insert_rule(null, "position", "relative", '');
                            }                    

                            if ($("#position-static").parent().hasClass("active") || $("#position-relative").parent().hasClass("active")){
                                $("#position-relative").trigger("click");
                            }

                            // Set default values for top and left options.
                            if ($("li.position-option.active").length > 0) {
                                $("#top-group,#left-group").each(function() {
                                set_default_value(get_option_id(this));
                            });
                            } else {
                                $("li.position-option").removeAttr("data-loaded"); // delete cached data.
                            }

                            option_change();

                        }
                    }
                }

                // Enter
                if (code == 13 && ctrlKey === false) {
                    if ($(e.target).is("#yp-set-animation-name")) {
                        $(".yp-animation-creator-start").trigger("click");
                    }
                }

                // Disable backspace key.
                if (code == 8 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    return false;
                }

                // Z Key
                if (code == 90 && ctrlKey == true && tagType === false) {

                    e.preventDefault();

                    undo_changes();

                    return false;

                }


                // G Key | Toggle smart guide
                if (code == 71 && ctrlKey === true && tagType === false) {
                    e.preventDefault();

                    body.toggleClass("yp-smart-guide-disabled");
                    return false;
                }


                // Y Key
                if (code == 89 && ctrlKey === true && tagType === false) {

                    e.preventDefault();

                    redo_changes();

                    return false;

                }

                // ESC
                if (code == 27 && ctrlKey === false && tagType === false) {

                    e.preventDefault();

                    if (mainBody.hasClass("autocomplete-active") === false && $(".iris-picker:visible").length === 0 && ($(".sweet-alert").css("display") == 'none') || $(".sweet-alert").length === 0) {

                        if (!mainBody.hasClass("css-editor-close-by-editor")) {

                            if ($("#cssEditorBar").css("display") == 'block') {
                                if (body.hasClass("yp-fullscreen-editor")) {
                                    body.removeClass("yp-fullscreen-editor");
                                }
                                $(".css-editor-btn").trigger("click");
                                return false;
                            } else if (mainBody.hasClass("yp-contextmenuopen")) {
                                iframe.trigger("scroll");
                                mainBody.removeClass("yp-contextmenuopen");
                                return false;
                            } else if (is_content_selected()) {
                                clean();
                                gui_update();
                                element_leave();
                                return false;
                            }

                        } else {
                            mainBody.removeClass("css-editor-close-by-editor");
                            return false;
                        }

                    } else {
                        body.removeClass("yp-select-open");
                    }

                }

                // Space key go to selected element
                if (code == 32 && shifted === false && ctrlKey === false && tagType === false && is_content_selected()) {

                    e.preventDefault();

                    var element = get_selected_element();

                    if (iframe.find(".yp-selected-tooltip").hasClass("yp-fixed-tooltip") || iframe.find(".yp-selected-tooltip").hasClass("yp-fixed-tooltip-bottom")) {
                        var height = parseInt($(window).height() / 2);
                        var selectedHeight = parseInt(element.height() / 2);
                        var scrollPosition = selectedHeight + element.offset().top - height;
                        iframe.scrollTop(scrollPosition);
                    }

                    return false;

                }

                // Space key select hovered element
                if (code == 32 && shifted === false && tagType === false && is_content_selected() === false && $(".yp-selector-mode").hasClass("active")) {

                    e.preventDefault();

                    if(mainBody.hasClass("yp-sharp-selector-mode-active")){
                        selector = $.trim(get_parents(null, "sharp"));
                    }else{
                        selector = $.trim(get_parents(null, "default"));
                    }

                    set_selector(selector,get_selected_element());

                    return false;

                }

                // Space key select multiple hovered element
                if (code == 32 && shifted === true && tagType === false && is_content_selected() === true && $(".yp-selector-mode").hasClass("active")) {

                    e.preventDefault();

                    var selectorCurrent = get_current_selector();
                    var selectorNew = get_parents(iframe.find(".yp-multiple-selected"), "sharp");
                    iframe.find(".yp-selected-others-multiable-box").remove();
                    iframe.find(".yp-multiple-selected").addClass("yp-selected-others").removeClass("yp-multiple-selected");
                    set_selector(selectorCurrent+","+selectorNew,get_selected_element());

                    return false;

                }

                // R Key
                if (code == 82 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    $(".yp-responsive-btn").trigger("click");
                    return false;
                }

                // M Key
                if (code == 77 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    $(".yp-ruler-btn").trigger("click");
                    return false;
                }

                // W Key
                if (code == 87 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    $(".yp-wireframe-btn").trigger("click");
                    return false;
                }

                // D Key
                if (code == 68 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    $(".info-btn").trigger("click");
                    return false;
                }

                // H Key
                if (code == 72 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    css_editor_toggle();
                    return false;
                }

                // L Key
                if (code == 76 && ctrlKey === false && tagType === false && is_dragging() === false) {
                    e.preventDefault();
                    body.toggleClass("yp-hide-borders-now");
                    return false;
                }

                // " Key
                if (code == 162 && ctrlKey === false && tagType === false && mainBody.hasClass("process-by-code-editor") === false) {
                    e.preventDefault();

                    if (is_animate_creator()) {
                        swal({title: "Sorry.",text: l18_cantEditor,type: "warning",animation: false});
                        return false;
                    }

                    $(".css-editor-btn").trigger("click");
                    return false;
                }

                // " For Chrome Key
                if (code == 192 && ctrlKey === false && tagType === false && mainBody.hasClass("process-by-code-editor") === false) {
                    e.preventDefault();

                    if (is_animate_creator()) {
                        swal({title: "Sorry.",text: l18_cantEditor,type: "warning",animation: false});
                        return false;
                    }

                    $(".css-editor-btn").trigger("click");
                    return false;
                }

                // F Key
                if (code == 70 && ctrlKey === false && tagType === false) {
                    e.preventDefault();
                    $(".yp-button-target").trigger("click");
                    return false;
                }

            });

            // Arrow Keys Up/Down The Value.
            $(".yp-after-prefix").keydown(function(e){

                if($(this).val() == 'xp'){
                    $(this).val("px");
                }

                var code = e.keyCode || e.which;

                if (code == 40 || code == 38) {

                    e.preventDefault();
                    // em -> % -> px
                    if ($(this).val() == 'em') {
                        $(this).val("%");
                    } else if ($(this).val() == '%') {
                        $(this).val("px");
                    } else if ($(this).val() == 'px') {
                        $(this).val("em");
                    }

                }

            });

            // Close Shortcut for editor.
            editor.commands.addCommand({

                name: 'close',
                bindKey: {
                    win: 'ESC',
                    mac: 'ESC'
                },
                exec: function() {

                    if (body.hasClass("yp-fullscreen-editor")) {
                        body.removeClass("yp-fullscreen-editor");
                    }

                    $(".css-editor-btn").trigger("click");
                    mainBody.removeClass("process-by-code-editor").addClass("css-editor-close-by-editor");

                },

                readOnly: false

            });

            // Disable forms in iframe.
            iframe.find("form").submit(function(e) {
                e.preventDefault();
                return false;
            });

            function check_undoable_history(){

                // Has Undo?
                if(editor.session.getUndoManager().hasUndo() === false){
                    $(".undo-btn").addClass("disabled");
                }else{
                    $(".undo-btn").removeClass("disabled");
                }

                // Has Redo?
                if(editor.session.getUndoManager().hasRedo() === false){
                    $(".redo-btn").addClass("disabled");
                }else{
                    $(".redo-btn").removeClass("disabled");
                }

            }

            // Keyup: Custom Slider Value
            $(".yp-after-css").keyup(function(e) {

                if($(".lock-btn.active").length == 0 && e.originalEvent){
                    var n = $(this).parent().parent().find(".wqNoUi-target");
                    slide_action(n, n.attr("id").replace("yp-", ""), false, true);
                }

            });

            $(".yp-ruler-btn").click(function() {

                if(is_content_selected() === false){
                    clean();
                }

                body.toggleClass("yp-metric-disable");
                gui_update();

                // Disable selector mode.
                if ($(this).hasClass("active") === false) {
                    if ($(".yp-selector-mode.active").length > 0) {
                        window.SelectorModeWasActive = true;
                        $(".yp-selector-mode").removeClass("active");
                    }
                } else {
                    $(".yp-selector-mode").addClass("active");
                }

                return false;
            });

            // Single selector
            $(".yp-sharp-selector-btn").click(function() {
                body.toggleClass("yp-sharp-selector-mode-active");
                if ($(".yp-selector-mode.active").length === 0) {
                    $(".yp-selector-mode").trigger("click");
                }
            });

            // Update on Enter Key.
            // Arrow Keys Up/Down The Value.
            $(".yp-after-css-val").keydown(function(e) {

                if($(this).val() == 'xp'){
                    $(this).val("px");
                }

                var code = e.keyCode || e.which;

                if (code == 38) {
                    e.preventDefault();
                    $(this).val(parseFloat($(this).val()) + parseFloat(1));
                }

                if (code == 40) {
                    e.preventDefault();
                    $(this).val(parseFloat($(this).val()) - parseFloat(1));
                }

                if(code == 13){
                    $(this).trigger("blur");
                    return false;
                }

            });

            var wasLast = false;
            $(".yp-after-css-val").keyup(function(e) {

                if($(this).val() == 'xp'){
                    $(this).val("px");
                }

                var code = e.keyCode || e.which;
                var range = $(this).getCursorPosition();
                var next = $(this).parent().find(".yp-after-prefix");
                
                if(range == $(this).val().length && wasLast === false){
                    wasLast = true;
                    return true;
                }

                if(range != $(this).val().length){
                    wasLast = false;
                }

                if(code == 39 && wasLast === true){
                    next.trigger("focus");
                    wasLast = false;
                }

            });

            
            var wasLastPrefix = false;
            $(".yp-after-prefix").keyup(function(e) {

                if($(this).val() == 'xp'){
                    $(this).val("px");
                }

                var code = e.keyCode || e.which;
                var range = $(this).getCursorPosition();
                var prev = $(this).parent().find(".yp-after-css-val");
                
                if(range === 0 && wasLastPrefix === false){
                    wasLastPrefix = true;
                    return true;
                }

                if(range !== 0){
                    wasLastPrefix = false;
                }

                if(code == 37 && wasLastPrefix === true){
                    prev.trigger("focus");
                    wasLastPrefix = false;
                }

            });

            // Update on Enter Key.
            // Arrow Keys Up/Down The Value.
            $(".yp-after-css-val").keyup(function(e) {

                // Number only
                var numbers = $(this).val().replace(/[^0-9.,-]/g,'');

                if(numbers.length === 0){
                    numbers = 0;
                }

                // non-number only
                var prefixs = $(this).val().replace(/[0-9.,-]/g,'');

                var prefixSelector = $(this).parent().find(".yp-after-prefix");

                if(prefixs.length > 0){

                    $(this).val(numbers);

                    prefixSelector.val(prefixs);

                    // Focus
                    prefixSelector.val(prefixSelector.val()).trigger("focus");

                }

            });

            // Getting ID.
            function get_option_id(element) {
                return $(element).attr("id").replace("-group", "");
            }

            $.fn.hasAttr = function(name) {  
               return this.attr(name) !== undefined;
            };

            // http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
            $.fn.getCursorPosition = function() {
                var input = this.get(0);
                if (!input) return; // No (input) element found
                if ('selectionStart' in input) {
                    // Standard-compliant browsers
                    return input.selectionStart;
                } else if (document.selection) {
                    // IE
                    input.focus();
                    var sel = document.selection.createRange();
                    var selLen = document.selection.createRange().text.length;
                    sel.moveStart('character', -input.value.length);
                    return sel.text.length - selLen;
                }
            };


            function redo_changes(){

                if(is_resizing() || is_dragging() || mainBody.hasClass("yp-processing-now")){
                        return false;
                    }

                    if (is_animate_creator()) {
                        swal({title: "Sorry.",text: l18_cantUndo,type: "warning",animation: false});
                        return false;
                    }

                    if (mainBody.hasClass("yp-animate-manager-active")) {
                        swal({title: "Sorry.",text: l18_cantUndoAnimManager,type: "warning",animation: false});
                        return false;
                    }

                    editor.commands.exec("redo", editor);

                    body.addClass("yp-css-data-trigger");
                    $("#cssData").trigger("keyup");

                    draw();

                    check_undoable_history();

            }

            function undo_changes(){

                if(is_resizing() || is_dragging() || mainBody.hasClass("yp-processing-now")){
                        return false;
                    }

                    if (is_animate_creator()) {
                        swal({title: "Sorry.",text: l18_cantUndo,type: "warning",animation: false});
                        return false;
                    }

                    if (mainBody.hasClass("yp-animate-manager-active")) {
                        swal({title: "Sorry.",text: l18_cantUndoAnimManager,type: "warning",animation: false});
                        return false;
                    }

                    editor.commands.exec("undo", editor);

                    body.addClass("yp-css-data-trigger");
                    $("#cssData").trigger("keyup");
                    draw();

                    // Update draggable after undo
                    var elx = iframeBody.find(".yp-selected");
                    if(elx.length > 0){

                        if(elx.css("position") == 'static'){
                            elx.css("position","relative");
                            iframeBody.find(".yp-selected-others").css("position","relative");
                        }

                    }

                check_undoable_history();

            }


            function isDefined(a){
                if(typeof a !== typeof undefined && a !== false && a != '' && a != ' ' && a != 'undefined' && a !== null){
                    return true;
                }else{
                    return false;
                }
            }

            function isUndefined(a){
                if(typeof a === typeof undefined || a === false || a === '' || a == ' ' || a == 'undefined' || a === null){
                    return true;
                }else{
                    return false;
                }
            }

            $.fn.cssImportant = function(rule, value) {

                // Set default CSS.
                this.css(rule, value);

                // add important
                $(this).attr("style", this.attr("style").replace(rule + ": " + value, rule + ": " + value + " !important"));

            };

            $(".yp-button-live").click(function() {

                var el = $(this);
                var href = el.attr("data-href");
                el.addClass("live-btn-loading");

                if (mainBody.hasClass("yp-yellow-pencil-demo-mode")) {
                    swal({title: "Sorry.",text: l18_live_preview,type: "info",animation: false});
                    el.removeClass("live-btn-loading");
                    return false;
                }

                var posting = $.post( ajaxurl, {
                    action: "yp_preview_data_save",
                    yp_data: get_clean_css(true)
                } );

                // Done.
                posting.complete(function(data) {
                    el.removeClass("live-btn-loading");
                    window.open(href, href);
                    return false;
                });

            });

            /* ---------------------------------------------------- */
            /* YP_SET_SELECTOR                                      */
            /*                                                      */
            /* Creating tooltip, borders. Set as selected element.  */
            /* ---------------------------------------------------- */
            function set_selector(selector,selected) {

                clean();

                window.setSelector = selector;

                var element = iframe.find(get_foundable_query(selector,true,false,false));

                body.attr("data-clickable-select", selector);

                if (iframe.find(".yp-will-selected").length > 0) {
                    iframe.find(".yp-will-selected").trigger("mouseover").trigger("click");
                    iframe.find(".yp-will-selected").removeClass("yp-will-selected");
                } else if(selected !== null){
                    selected.trigger("mouseover").trigger("click");
                }else{
                    element.filter(":visible").first().trigger("mouseover").trigger("click");
                }

                if (element.length > 1) {
                    element.addClass("yp-selected-others");
                    get_selected_element().removeClass("yp-selected-others");
                }

                body.addClass("yp-content-selected");

                window.orginalHeight = parseFloat(element.css("height").replace(/px/g,''));
                window.orginalWidth = parseFloat(element.css("width").replace(/px/g,''));

                if(element.css("float") == 'right'){
                    body.addClass("yp-element-float");
                }else{
                    body.removeClass("yp-element-float");
                }


                if(body.hasClass("yp-animate-manager-active")){
                    animation_manager();
                }

                if($(".advanced-info-box").css("display") == 'block' && $(".element-btn").hasClass("active")){
                    update_design_information("element");
                }

                var tooltip = iframe.find(".yp-selected-tooltip");
                tooltip.html("<small class='yp-tooltip-small'>" + iframe.find(".yp-selected-tooltip small").html() + "</small> " + selector);

                // Use native hover system
                if (selector.match(/:hover/g)) {

                    body.addClass("yp-selector-hover");
                    body.attr("data-yp-selector", ":hover");
                    $(".yp-contextmenu-hover").addClass("yp-active-contextmenu");
                    iframe.find(".yp-selected-tooltip span").remove();
                    selector = selector.replace(/:hover/g, "");

                }

                // Use native focus system
                if (selector.match(/:focus/g)) {

                    body.addClass("yp-selector-focus");
                    body.attr("data-yp-selector", ":focus");
                    $(".yp-contextmenu-focus").addClass("yp-active-contextmenu");
                    iframe.find(".yp-selected-tooltip span").remove();
                    selector = selector.replace(/:focus/g, "");

                }

                // Use native visited system
                if (selector.match(/:visited/g)) {

                    body.addClass("yp-selector-visited");
                    body.attr("data-yp-selector", ":visited");
                    iframe.find(".yp-selected-tooltip span").remove();
                    selector = selector.replace(/:visited/g, "");

                }

                // Use native visited system
                if (selector.match(/:link/g)) {

                    body.addClass("yp-selector-link");
                    body.attr("data-yp-selector", ":link");
                    iframe.find(".yp-selected-tooltip span").remove();
                    selector = selector.replace(/:link/g, "");

                }

                // Use native visited system
                if (selector.match(/:active/g)) {

                    body.addClass("yp-selector-active");
                    body.attr("data-yp-selector", ":active");
                    iframe.find(".yp-selected-tooltip span").remove();
                    selector = selector.replace(/:active/g, "");

                }

                css_editor_toggle(true); // show if hide

                body.attr("data-clickable-select", selector);

                insert_default_options();

                gui_update();

                draw();

                if(body.hasClass("yp-animate-manager-active")){
                    animation_manager();
                }

                // Update the element informations.
                if($(".advanced-info-box").css("display") == 'block' && $(".element-btn").hasClass("active")){
                    update_design_information("element");
                }

                window.setSelector = false;

            }

            // Get All Data and set to editor.
            editor.setValue(get_clean_css(true));
            editor.getSession().setUndoManager(new ace.UndoManager());

            // Tooltip
            $('[data-toggle="tooltip"]').tooltip({
                animation: false,
                container: ".yp-select-bar",
                html: true
            }).on('shown.bs.tooltip', function () {
                
                // Don't show if popover visible
                if($(".popover").length > 0){
                    $(this).tooltip("hide");
                }

            });

            $('[data-toggle="tooltipTopBottom"]').tooltip({
                animation: false,
                container: ".yp-select-bar",
                 template: '<div class="tooltip hidden-on-fullscreen"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                html: true
            });

            $('[data-toggle="tooltip-bar"]').tooltip({
                animation: false,
                container: "body",
                html: true
            });
            $('.info-btn').on('show.bs.tooltip', function () {
                if($(this).hasClass("active")){
                    return false;
                }
            });
            $('[data-toggle="popover"]').popover({
                animation: false,
                trigger: 'hover',
                container: ".yp-select-bar"
            });

            $('.yp-option-group,.yp-advanced-option').on('shown.bs.popover', function () {
                
                // Don't show if popover visible
                if(parseFloat($(".popover").css("top")) < 80){
                    $(this).popover("hide");
                }

            });

            $(".yp-none-btn").tooltip({
                animation: false,
                container: '.yp-select-bar',
                title: l18_none
            });

            $(".yp-element-picker").tooltip({
                animation: false,
                placement: 'bottom',
                container: '.yp-select-bar',
                title: l18_picker
            });

            $('[data-toggle="tooltipAnimGenerator"]').tooltip({
                animation: false,
                html: true
            });


            // CSSEngine is javascript based jquery
            // plugin by WaspThemes Team.
            $(document).CallCSSEngine(get_clean_css(true));

            // Set Class to Body.
            body.addClass("yp-yellow-pencil");
            body.addClass("yp-yellow-pencil-loaded");

            // Draggable editor area
            $(".yp-select-bar").draggable({
                handle: ".yp-editor-top",
                start: function(){
                    mainBody.append("<div class='fake-layer'></div>");
                },
                stop: function(){
                    $(".fake-layer").remove();
                }
            });

            $(".anim-bar").draggable({
                handle: ".anim-bar-title",
                stop: function() {
                    $(".anim-bar").addClass("anim-bar-dragged");
                }
            });

            $("#yp-set-animation-name").keyup(function() {
                $(this).val(get_basic_id($(this).val()));
            });

            // Fullscreen Editor
            $(".yp-css-fullscreen-btn").click(function() {

                // Fullscreen class
                body.toggleClass("yp-fullscreen-editor");

                editor.focus();
                editor.execCommand("gotolineend");
                editor.resize();

            });

            // If There not have any selected item
            // and if mouseover on options, so hide borders.
            $(".top-area-btn-group,.yp-select-bar,.metric").hover(function() {
                if (is_content_selected() === false) {
                    clean();
                }
            });

            function update_animate_creator_view() {
                if (!$(".anim-bar").hasClass("anim-bar-dragged")) {
                    $(".anim-bar").css("left", parseFloat($(window).width() / 2) - ($(".anim-bar").width() / 2));
                }
            }

            // Only number
            $(document).on('keydown keyup', '.scenes .scene input', function(e){

                $(this).val(number_filter($(this).val().replace(/\-/g,'')));

                if (parseFloat($(this).val()) > 100) {
                    $(this).val('100');
                }

                if (parseFloat($(this).val()) < 0) {
                    $(this).val('0');
                }

            });

            // Last scene always 100
            $(document).on('keyup keydown blur', '.scenes .scene:not(.scene-add):last input', function(e) {

                $(this).val('100');

            });

            // First scene always 0
            $(document).on('keyup keydown blur', '.scenes .scene:first-child input', function(e) {

                $(this).val('0');

            });

            function yp_create_anim() {

                if (iframe.find(".yp-anim-scenes style").length === 0) {
                    swal({title: "Sorry.",text: l18_allScenesEmpty,type: "warning",animation: false});
                    return false;
                }

                // Variables
                var total = $(".scenes .scene").length;
                var scenesData = '';
                var i;

                // Create animation from data.
                for (i = 1; i < total; i++) {

                    scenesData = scenesData + $(".scenes .scene-" + i + " input").val() + "% {";

                    iframe.find(".yp-anim-scenes").find(".style-scene-" + i).each(function() {
                        scenesData = scenesData + (($(this).html().match(/\{(.*?)\}/g)).toString().replace("{", "").replace("}", "")) + ";";
                    });

                    scenesData = scenesData + "}";

                }

                // Remove webkit prefix.
                scenesData = scenesData.replace(/-webkit-(.*?);/g, '');

                var scenesDataReverse = scenesData.replace(/\}/g, "}YKSYXA");
                var scenesDataReverseArray = scenesDataReverse.split("YKSYXA").reverse();

                // wait
                var watingForAdd = [];
                var added = '{';
                var x,lineData,rules,countT,count;

                for (i = 1; i < scenesDataReverseArray.length; i++) {

                    // Anim part example data.
                    lineData = $.trim(scenesDataReverseArray[i]);
                    lineData = lineData.split("{")[1].split("}")[0];

                    // If is last ie first. ie 0%, no need.
                    if (scenesDataReverseArray.length - 1 == i) {

                        //$(".scenes .scene-1").trigger("click");

                        for (var k = 0; k < watingForAdd.length; k++) {

                            countT = 0;

                            // Search in before
                            if (added.match("{" + watingForAdd[k] + ":") !== null) {
                                countT = parseInt(added.match("{" + watingForAdd[k] + ":").length);
                            }

                            if (added.match(";" + watingForAdd[k] + ":") !== null) {
                                countT = countT + parseInt(added.match(";" + watingForAdd[k] + ":").length);
                            }

                            if (countT === 0) {

                                var el = get_selected_element();
                                var val = el.css(watingForAdd[k]);

                                if (watingForAdd[k] == 'top' && val == 'auto') {
                                    val = "0px";
                                }

                                if (watingForAdd[k] == 'left' && val == 'auto') {
                                    val = "0px";
                                }

                                if (watingForAdd[k] == 'width' && val == 'auto') {
                                    val = el.width();
                                }

                                if (watingForAdd[k] == 'height' && val == 'auto') {
                                    val = el.height();
                                }

                                if (watingForAdd[k] == 'opacity' && val == 'auto') {
                                    val = "1";
                                }

                                if (watingForAdd[k] != 'right' && val != 'auto') {
                                    if (watingForAdd[k] != 'bottom' && val != 'auto') {
                                        var all = watingForAdd[k] + ":" + val + ";";
                                        scenesData = scenesData.replace("0% {", "0% {" + all);
                                        added = added + all;
                                    }
                                }

                            }

                        }

                    }

                    // Rules of this part.
                    rules = lineData.split(";");

                    // get only rules names.
                    for (x = 0; x < rules.length; x++) {
                        if (rules[x].split(":")[0] != '') {

                            var founded = rules[x].split(":")[0];
                            count = 0;

                            // Search in before
                            if (scenesData.match("{" + founded + ":") !== null) {
                                count = parseInt(scenesData.match("{" + founded + ":").length);
                            }

                            if (scenesData.match(";" + founded + ":") !== null) {
                                count = count + parseInt(scenesData.match(";" + founded + ":").length);
                            }

                            if (count < parseInt(total - 1)) {
                                watingForAdd.push(founded);
                            }

                        }
                    }

                }

                /* Adding current line data to next line datas. */
                var scenesDataNormal = scenesData.replace(/\}/g, "}TYQA");
                var scenesDataNormalArray = scenesDataNormal.split("TYQA");

                var rulesNames = [];
                var rulesValues = [];

                for (i = 0; i < scenesDataNormalArray.length; i++) {

                    // Anim part example data.
                    lineData = $.trim(scenesDataNormalArray[i]);

                    if (lineData != '' && lineData != ' ') {

                        lineData = lineData.split("{")[1].split("}")[0];

                        // Rules of this part.
                        rules = lineData.split(";");

                        // Each all rules
                        for (x = 0; x < rules.length; x++) {
                            if (rules[x].split(":")[0] != '') {

                                // Get rule name
                                var foundedName = rules[x].split(":")[0];
                                var foundedValue = rules[x].split(":")[1].split(";");

                                // Get rule value
                                if (isUndefined(foundedValue)) {
                                    foundedValue = rules[x].split(":")[1].split("}");
                                }

                                // Clean important prefix.
                                foundedValue = $.trim(foundedValue).replace(/\s+?!important/g,'').replace(/\;$/g,'');

                                // If same rule have in rulesNames, get index.
                                var index = rulesNames.indexOf(foundedName);

                                // Delete ex rule data.
                                if (index != -1) {
                                    rulesNames.splice(index, 1);
                                    rulesValues.splice(index, 1);
                                }

                                // Update with new rules.
                                rulesNames.push(foundedName);
                                rulesValues.push(foundedValue);

                            }

                        }

                        var updatedLine = "{" + lineData;

                        for (var t = 0; t < rulesNames.length; t++) {

                            var current = rulesNames[t];
                            var currentVal = rulesValues[t];

                            countT = 0;

                            // Search in this line
                            if (updatedLine.match("{" + current + ":") !== null) {
                                countT = parseInt(updatedLine.match("{" + current + ":").length);
                            }

                            if (updatedLine.match(";" + current + ":") !== null) {
                                countT = count + parseInt(updatedLine.match(";" + current + ":").length);
                            }

                            // If any rule have in rulesnames and not have in this line,
                            // so add this rule to this line.
                            if (countT < 1) {
                                updatedLine = "{" + current + ":" + currentVal + ";" + updatedLine.replace("{", "");
                            }

                        }

                        // update return value.
                        var pre = $.trim(scenesDataNormalArray[i]).split("{")[0] + "{" + lineData.replace("{", "") + "}";
                        var upNew = $.trim(scenesDataNormalArray[i]).split("{")[0] + "{" + updatedLine.replace("{", "") + "}";
                        scenesData = scenesData.replace(pre, upNew);

                    }

                }

                // Current total scenes
                total = scenesData.match(/\{/g).length;

                // Add animation name.
                scenesData = "@keyframes " + $("#yp-set-animation-name").val() + "{\r" + scenesData + "\r}";

                scenesData = scenesData.replace(/\}/g, "}\r");

                scenesData = scenesData.replace(";;","");

                return scenesData;

            }

            // Play/stop control
            $(document).on("click", ".yp-animation-player,.yp-anim-play", function() {

                var element = $(this);

                var willActive = 1;

                $(".scenes .scene").each(function(i) {

                    if ($(this).hasClass("scene-active")) {
                        willActive = (i + 1);
                    }

                });

                // first scene default.
                $(".scenes .scene-1").trigger("click");

                var anim = yp_create_anim();

                if (anim === false) {
                    return false;
                }

                var delay,delayWait;

                body.addClass("yp-hide-borders-now");

                // Clean scene classes.
                var newClassList = $.trim(mainBody.attr("class").replace(/yp-scene-[0-9]/g, ''));
                mainBody.attr("class", newClassList);

                newClassList = $.trim(iframeBody.attr("class").replace(/yp-scene-[0-9]/g, ''));
                iframeBody.attr("class", newClassList);

                // AddClass
                body.addClass("yp-animate-test-playing");

                // Clean
                iframe.find(".animate-test-drive").empty();

                // Animate
                iframe.find(".animate-test-drive").append("<style>" + anim + "</style>");

                // Getting duration.
                if ($('#animation-duration-value').val().indexOf(".") != -1) {
                    delay = $('#animation-duration-value').val().split(".")[0];
                } else {
                    delay = $('#animation-duration-value').val();
                }

                if ($('#animation-duration-after').val() == 's') {
                    delayWait = delay * 1000; // second to milisecond.
                } else {
                    delayWait = delay; //milisecond
                }

                delayWait = delayWait - 10;

                delay = delay + $('#animation-duration-after').val();

                // Play.
                iframe.find(".animate-test-drive").append("<style>body.yp-animate-test-playing .yp-selected,body.yp-animate-test-playing .yp-selected-others{animation-name:" + $("#yp-set-animation-name").val() + " !important;animation-duration:" + delay + " !important;animation-iteration-count:1 !important;}</style>");

                // playing.
                element.html("Playing"+'<span style="color:#B73131 !important;" class="dashicons dashicons-controls-play"></span>');
                $(".anim-play").html("Playing"+'<span style="color:#B73131 !important;" class="dashicons dashicons-controls-play"></span>');

                clear_animation_timer();

                // Wait until finish. END.
                window.animationTimer4 = setTimeout(function() {

                    element.html("Play"+'<span class="dashicons dashicons-controls-play"></span>');
                    $(".anim-play").html("Play"+'<span class="dashicons dashicons-controls-play"></span>');
                    body.removeClass("yp-animate-test-playing");
                    iframe.find(".animate-test-drive").empty();
                    body.removeClass("yp-hide-borders-now");

                    $(".scenes .scene-" + willActive + "").trigger("click");

                    element_animation_end();

                    draw();

                }, delayWait);

            });

            // Start animation creator.
            $(".yp-animation-creator-start,.yp-anim-save").click(function() {

                var text = $('.yp-animation-creator-start').text();

                // Save Section
                if (text == l18_save) {

                    // first scene default.
                    $(".scenes .scene-1").trigger("click");

                    var animName = $("#yp-set-animation-name").val();
                    var anim = yp_create_anim();

                    if (anim === false) {
                        return false;
                    }

                    $(".yp-animation-creator-start").text(text == l18_create ? l18_save : l18_create);
                    $(".yp-anim-save").html($(".yp-animation-creator-start").text()+'<span class="dashicons dashicons-flag"></span>');

                    var posting = $.post(ajaxurl, {

                        action: "yp_add_animation",
                        yp_anim_data: anim,
                        yp_anim_name: animName

                    });

                    // Done.
                    posting.complete(function(data) {
                        //Saved.
                    });

                    // Add animation name
                    $("#yp-animation-name-data").append("<option data-text='" + animName + "' value='" + animName + "'>" + animName + "</option>");

                    // Get data by select
                    var data = [];
                    $("#yp-animation-name-data option").each(function() {
                        data.push($(this).text());
                    });

                    // Autocomplete script
                    $("#yp-animation-name").autocomplete({
                        source: data
                    });

                    // Append style
                    iframe.find(".yp-animate-data").append("<style id='" + $("#yp-set-animation-name").val() + "style'>" + anim + "</style>");
                    iframe.find(".yp-animate-data").append("<style id='webkit-" + $("#yp-set-animation-name").val() + "style'>" + anim.replace("@keyframes", "@-webkit-keyframes") + "</style>");

                    yp_anim_cancel();

                    // Set animation name
                    setTimeout(function() {
                        insert_rule(null, "animation-name", animName, '');
                        insert_rule(null, "animation-fill-mode", 'both', '');
                        $("li.animation-option").removeAttr("data-loaded");
                        $("#yp-animation-name").val(animName).trigger("blur");
                    }, 300);

                    return false;

                }

                // append anim data area.
                if (iframe.find(".yp-anim-scenes").length === 0) {

                    // Append style area.
                    if (the_editor_data().length <= 0) {
                        iframeBody.append("<div class='yp-styles-area'></div>");
                    }

                    // Append anim style area.
                    the_editor_data().after('<div class="yp-anim-scenes"><div class="scene-1"></div><div class="scene-2"></div><div class="scene-3"></div><div class="scene-4"></div><div class="scene-5"></div><div class="scene-6"></div></div><div class="animate-test-drive"></div>');

                }

                // close css editor
                if (mainBody.hasClass("yp-css-editor-active")) {
                    $(".yp-css-close-btn").trigger("click");
                }

                // Start
                body.addClass("yp-anim-creator");

                body.addClass("yp-scene-1");
                body.attr("data-anim-scene", "scene-1");

                $(".scene-active").removeClass("scene-active");

                $(".scenes .scene:first-child").addClass("scene-active");

                // Resize scenes area.
                update_animate_creator_view();

                // Back to list.
                $(".animation-option.active > h3").trigger("click");

                $(this).text(text == l18_create ? l18_save : l18_create);
                $(".yp-anim-save").html($(".yp-animation-creator-start").text()+'<span class="dashicons dashicons-flag"></span>');

            });

            function yp_anim_cancel() {

                // Save to create.
                $(".yp-animation-creator-start").text(l18_create);

                // Clean classes.
                body.removeClass("yp-anim-creator").removeAttr("data-anim-scene").removeClass("yp-anim-link-toggle").removeClass("yp-animate-test-playing");

                body.removeAttr("data-anim-scene");

                // Clean scene classes.
                var newClassList = $.trim(mainBody.attr("class").replace(/yp-scene-[0-9]/g, ''));
                mainBody.attr("class", newClassList);

                newClassList = $.trim(iframeBody.attr("class").replace(/yp-scene-[0-9]/g, ''));
                iframeBody.attr("class", newClassList);

                // Clean all scene data.
                iframe.find(".yp-anim-scenes .scene-1,.yp-anim-scenes .scene-2,.yp-anim-scenes .scene-3,.yp-anim-scenes .scene-4,.yp-anim-scenes .scene-5,.yp-anim-scenes .scene-6").empty();

                if ($(".yp-anim-cancel-link").length > 0) {
                    $(".yp-anim-cancel-link").trigger("click");
                }

                // Set default data again.
                insert_default_options();

                // Delete 3,4,5,6scenes.
                $(".anim-bar .scenes .scene-6 .scene-delete,.anim-bar .scenes .scene-5 .scene-delete,.anim-bar .scenes .scene-4 .scene-delete,.anim-bar .scenes .scene-3 .scene-delete").trigger("click");

                // delete test data
                iframe.find(".animate-test-drive").empty();

                gui_update();
                draw();

            }

            $(document).on("click", ".scenes .scene .scene-delete", function() {

                var current = $(this).parent().attr("data-scene").replace("scene-", "");
                var next = $(".scenes .scene").length - 1;

                // delete all
                $(".scenes .scene:not('.scene-add')").remove();

                for (var i = 1; i < next; i++) {
                    $(".scene-add").trigger("click");
                }

                if (next == 6) {
                    $(".scene-add").show();
                    update_animate_creator_view();
                }

                // Delete all styles for this scene.
                iframe.find(".yp-anim-scenes .scene-" + current + "").empty();

                // prev active
                $(".scenes .scene-" + (current - 1) + "").trigger("click");

                return false;

            });

            $(document).on("click", ".scenes .scene", function() {

                // Not scene add.
                if ($(this).hasClass("scene-add")) {
                    var next = $(".scenes .scene").length;

                    $(".scenes .scene-let-delete").removeClass("scene-let-delete");

                    $(".scene-add").before('<div class="scene-let-delete scene scene-' + next + '" data-scene="scene-' + next + '"><span class="dashicons dashicons-trash scene-delete"></span><p>' + l18_scene + ' ' + next + '<span><input type="text" value="100" /></span></p></div>');

                    // select added scene.
                    $(".scenes .scene-" + next + "").trigger("click");

                    $(".scene-1 input").val("0");
                    $(".scene-2 input").val("100");

                    if (next == 3) {
                        $(".scene-1 input").val("0");
                        $(".scene-2 input").val("50");
                        $(".scene-3 input").val("100");
                    }

                    if (next == 4) {
                        $(".scene-1 input").val("0");
                        $(".scene-2 input").val("33.3");
                        $(".scene-3 input").val("66.6");
                        $(".scene-4 input").val("100");
                    }

                    if (next == 5) {
                        $(".scene-1 input").val("0");
                        $(".scene-2 input").val("25");
                        $(".scene-3 input").val("50");
                        $(".scene-4 input").val("75");
                        $(".scene-5 input").val("100");
                    }

                    if (next == 6) {
                        $(".scene-1 input").val("0");
                        $(".scene-2 input").val("20");
                        $(".scene-3 input").val("40");
                        $(".scene-4 input").val("60");
                        $(".scene-5 input").val("80");
                        $(".scene-6 input").val("100");
                    }

                    if (next == 6) {
                        $(".scene-add").hide();
                    }
                    update_animate_creator_view();
                    return false;
                }

                // Set active class
                $(".scene-active").removeClass("scene-active");
                $(this).addClass("scene-active");

                // Update current scene.
                body.attr("data-anim-scene", $(this).attr("data-scene"));

                // Delete ex scene classes.
                var newClassList = $.trim(mainBody.attr("class").replace(/yp-scene-[0-9]/g, ''));
                mainBody.attr("class", newClassList);

                newClassList = $.trim(iframeBody.attr("class").replace(/yp-scene-[0-9]/g, ''));
                iframeBody.attr("class", newClassList);

                // Add new scene class.
                body.addClass("yp-" + $(this).attr("data-scene"));

                // loop
                for (var currentVal = parseInt($(this).attr("data-scene").replace("scene-", ""));currentVal > 1; currentVal--) {
                    if (currentVal !== 0) {
                        body.addClass("yp-scene-" + currentVal);
                    }
                }

                insert_default_options();
                $(".yp-disable-btn.active").trigger("click");

                draw();

            });

            $(".yp-anim-cancel").click(function() {
                $(".yp-anim-cancel-link").trigger("click");
            });


            // Credit: http://web.archive.org/web/20120918093154/http://lehelk.com/2011/05/06/script-to-remove-diacritics
            function removeDiacritics (str) {

              var defaultDiacriticsRemovalMap = [
                {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
                {'base':'AA','letters':/[\uA732]/g},
                {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
                {'base':'AO','letters':/[\uA734]/g},
                {'base':'AU','letters':/[\uA736]/g},
                {'base':'AV','letters':/[\uA738\uA73A]/g},
                {'base':'AY','letters':/[\uA73C]/g},
                {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
                {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
                {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
                {'base':'DZ','letters':/[\u01F1\u01C4]/g},
                {'base':'Dz','letters':/[\u01F2\u01C5]/g},
                {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
                {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
                {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
                {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
                {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
                {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
                {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
                {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
                {'base':'LJ','letters':/[\u01C7]/g},
                {'base':'Lj','letters':/[\u01C8]/g},
                {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
                {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
                {'base':'NJ','letters':/[\u01CA]/g},
                {'base':'Nj','letters':/[\u01CB]/g},
                {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
                {'base':'OI','letters':/[\u01A2]/g},
                {'base':'OO','letters':/[\uA74E]/g},
                {'base':'OU','letters':/[\u0222]/g},
                {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
                {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
                {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
                {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
                {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
                {'base':'TZ','letters':/[\uA728]/g},
                {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
                {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
                {'base':'VY','letters':/[\uA760]/g},
                {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
                {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
                {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
                {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
                {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
                {'base':'aa','letters':/[\uA733]/g},
                {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
                {'base':'ao','letters':/[\uA735]/g},
                {'base':'au','letters':/[\uA737]/g},
                {'base':'av','letters':/[\uA739\uA73B]/g},
                {'base':'ay','letters':/[\uA73D]/g},
                {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
                {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
                {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
                {'base':'dz','letters':/[\u01F3\u01C6]/g},
                {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
                {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
                {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
                {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
                {'base':'hv','letters':/[\u0195]/g},
                {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
                {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
                {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
                {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
                {'base':'lj','letters':/[\u01C9]/g},
                {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
                {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
                {'base':'nj','letters':/[\u01CC]/g},
                {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
                {'base':'oi','letters':/[\u01A3]/g},
                {'base':'ou','letters':/[\u0223]/g},
                {'base':'oo','letters':/[\uA74F]/g},
                {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
                {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
                {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
                {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
                {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
                {'base':'tz','letters':/[\uA729]/g},
                {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
                {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
                {'base':'vy','letters':/[\uA761]/g},
                {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
                {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
                {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
                {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
              ];

              for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
                str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
              }

              return str;

            }


            // Yellow Pencil Toggle Advanced Boxes. Used For Parallax, Transform.
            $(".yp-advanced-link").click(function() {

                // Adding animation link
                if ($(this).hasClass("yp-add-animation-link")) {

                    body.toggleClass("yp-anim-link-toggle");
                    $(this).toggleClass("yp-anim-cancel-link");

                    if (!$(this).hasClass("yp-anim-cancel-link")) {
                        yp_anim_cancel();
                    }

                    if ($("#animation-duration-value").val() == '0' || $("#animation-duration-value").val() == '0.00'){
                        $("#animation-duration-value").val("1");
                        $("#animation-duration-value").trigger("blur");
                    }

                    // update animation ame.
                    if($(this).hasClass("yp-add-animation-link")){
                        var slctor = get_current_selector();
                        var animID = removeDiacritics(get_basic_id(uppercase_first_letter(get_tag_information(slctor)))+"_Animation_"+Math.floor((Math.random() * 99)));
                        $("#yp-set-animation-name").val(animID).trigger("focus");
                    }

                    var text = $('.yp-add-animation-link').text();
                    $('.yp-add-animation-link').text(text == l18_CreateAnimate ? l18_cancel : l18_CreateAnimate);

                    gui_update();
                    return false;
                }

                $(".yp-on").not(this).removeClass("yp-on");

                $(".yp-advanced-option").not($(this).next(".yp-advanced-option")).hide(0);

                $(this).next(".yp-advanced-option").toggle(0);

                $(this).toggleClass("yp-on");

                gui_update();

            });

            // Background Assents Set Active Click.
            $(".yp-bg-img-btn").click(function() {

                $(this).toggleClass("active");
                $(".yp_background_assets").toggle();

                gui_update();

            });

            $(".top-area-btn,.yp-css-close-btn").click(function(){
                setTimeout(function(){
                    window.FrameleftOffset = undefined;
                    draw_responsive_handle();
                },50);
            });

            // Active Class For undo, redo, CSS Editor buttons.
            $(".top-area-btn:not(.undo-btn):not(.redo-btn):not(.css-editor-btn)").click(function(){

                if(is_animate_creator() === false){

                    $(this).toggleClass("active");
                    $(this).tooltip("hide");

                }else if($(this).hasClass("yp-selector-mode") === false && $(this).hasClass("yp-button-target") === false){

                    $(this).toggleClass("active");
                    $(this).tooltip("hide");

                }
                
            });

            // Fullscreen
            $(".fullscreen-btn").click(function() {
                toggle_fullscreen(document.body);
            });

            // Undo
            $(".undo-btn").click(function() {

                undo_changes();

            });

            // Redo
            $(".redo-btn").click(function() {

                redo_changes();

            });

            // Background Assents Loading On Scrolling.
            $(".yp_background_assets").scroll(function() {

                $(".yp_bg_assets").filter(":onScreenFrame").each(function() {
                    $(this).css("backgroundImage", "url(" + $(this).data("url") + ")");
                });

            });

            // Set Background Assents
            $(".yp-bg-img-btn:not(.yp-first-clicked)").click(function() {

                $(this).addClass("yp-first-clicked");

                $(".yp_bg_assets").filter(":onScreenFrame").each(function() {
                    $(this).css("backgroundImage", "url(" + $(this).data("url") + ")");
                });

            });

            // Flat color helper toggle
            $(".yp-flat-colors").click(function() {

                $(this).toggleClass("active");
                $(this).parent().find(".yp_flat_colors_area").toggle();

                gui_update();

            });

            // Meterial color helper toggle
            $(".yp-meterial-colors").click(function() {

                $(this).toggleClass("active");
                $(this).parent().find(".yp_meterial_colors_area").toggle();

                gui_update();

            });

            // Nice color helper toggle.
            $(".yp-nice-colors").click(function() {

                $(this).parent().find(".yp_nice_colors_area").toggle();
                $(this).toggleClass("active");

                gui_update();

            });

            // Image Uploader
            $(".yp-upload-btn").click(function() {

                // Get iframe contents.
                $('#image_uploader iframe').attr('src',$('#image_uploader iframe').attr('data-url'));

                $('#image_uploader iframe').attr('src', function(i, val){
                    return val;
                });

                window.send_to_editor = function(output) {

                    var imgurl = output.match(/src="(.*?)"/g);
                    var imgNew = '';

                    imgurl = imgurl.toString().replace('src="', '').replace('"', '');

                    // Always get full size.
                    if (imgurl != '') {

                        var y = imgurl.split("-").length - 1;

                        if (imgurl.split("-")[y].match(/(.*?)x(.*?)\./g) !== null) {

                            imgNew = imgurl.replace("-" + imgurl.split("-")[y], '');

                            // format
                            if (imgurl.split("-")[y].indexOf(".") != -1) {
                                imgNew = imgNew + "." + imgurl.split("-")[y].split(".")[1];
                            }

                        } else {
                            imgNew = imgurl;
                        }

                    }

                    $("#yp-background-image").val(imgNew).trigger("keyup");

                    window.send_to_editor = window.restore_send_to_editor;

                    $("#image_uploader").toggle();
                    $("#image_uploader_background").toggle();

                };

                $("#image_uploader").toggle();
                $("#image_uploader_background").toggle();

            });

            // Image Uploader close
            $("#image_uploader_background").click(function() {
                $("#image_uploader").toggle();
                $("#image_uploader_background").toggle();
                $('#image_uploader iframe').attr('src', function(i, val) {
                    return val;
                });
            });

            // Uploader callback
            window.restore_send_to_editor = window.send_to_editor;

            window.send_to_editor = function(html) {

                var imgurl = $('img', html).attr('src');
                $("#yp-background-image").val(imgurl);

                window.send_to_editor = window.restore_send_to_editor;

                $("#image_uploader").toggle();
                $("#image_uploader_background").toggle();
                $('#image_uploader iframe').attr('src', function(i, val) {
                    return val;
                });

            };

            // Trigger Options Update.
            window.option_changeType = 'auto';
            option_change();
            window.option_changeType = 'default';

            // The title
            $("title").html("Yellow Pencil: " + iframe.find("title").html());

            // Check before exit page.
            window.onbeforeunload = confirm_exit;

            // exit confirm
            function confirm_exit() {

                if ($(".yp-save-btn").hasClass("waiting-for-save")) {
                    return confirm(l18_sure);
                }

            }

            // Save Button
            $(".yp-save-btn").on("click", function() {

                // If all changes already saved, So Stop.
                if ($(this).hasClass("yp-disabled")) {
                    return false;
                }

                // Getting Customized page id.
                var id = window.location.href.split("&yp_id=");

                if (isDefined(id[1])) {
                    id = id[1].split("&");
                    id = id[0];
                } else {
                    id = undefined;
                }

                // Getting Customized Post Type
                var type = window.location.href.split("&yp_type=");
                if (isDefined(type[1])) {
                    type = type[1].split("&");
                    type = type[0];
                } else {
                    type = undefined;
                }

                // Send Ajax If Not Demo Mode.
                if (!mainBody.hasClass("yp-yellow-pencil-demo-mode")) {

                    var data = get_clean_css(true);

                    // Lite Version Checking.
                    var status = true;

                    if (mainBody.hasClass("wtfv")) {

                        if (
                            data.indexOf("font-family:") != -1 ||
                            data.indexOf("background-color:") != -1 ||
                            data.indexOf("background-image:") != -1 ||
                            data.indexOf("animation-name:") != -1 ||
                            data.indexOf("filter:") != -1 ||
                            data.indexOf("opacity:") != -1 ||
                            data.match(/\s\s+height\:/g) !== null ||
                            data.match(/\s\s+width\:/g) !== null ||
                            data.match(/\s\s+color\:/g) !== null){

                            status = false;

                            $(".wt-save-btn").html(l18_save).removeClass("waiting-for-save").removeClass("wt-disabled");

                            $(".yp-info-modal,.yp-popup-background").show();

                        } else {

                            // BeforeSend
                            $(".yp-save-btn").html(l18_saving).addClass("yp-disabled");

                        }

                    } else {

                        // BeforeSend
                        $(".yp-save-btn").html(l18_saving).addClass("yp-disabled");

                    }

                    // Convert CSS To Data and save.
                    if (mainBody.hasClass("yp-need-to-process")) {

                        if (status) {
                            process(false, id, type);
                        }

                    } else {

                        if (status) {

                            var posting = $.post(ajaxurl, {

                                action: "yp_ajax_save",
                                yp_id: id,
                                yp_stype: type,
                                yp_data: data,
                                yp_editor_data: get_editor_data()

                            });

                            $.post(ajaxurl, {

                                action: "yp_preview_data_save",
                                yp_data: data

                            });


                            // Done.
                            posting.complete(function(data) {
                                $(".yp-save-btn").html(l18_saved).addClass("yp-disabled").removeClass("waiting-for-save");
                            });

                        }

                    }

                } else {

                    swal({title: "Sorry.",text: l18_demo_alert,type: "info",animation: false});
                    $(".yp-save-btn").html(l18_saved).addClass("yp-disabled").removeClass("waiting-for-save");

                }

            });



            // Be sure there not have any element animating.
            function check_with_parents(element, css, value, comparison){

                var checkElements = element.add(element.parents());
                var animation_fill_mode,el,returnValue = true;

                checkElements.each(function(){

                    el = $(this);

                    animation_fill_mode = null;

                    // Be sure there not have any element animating.
                    if(el.hasClass("yp-animating") === false){

                        // nowdays a lot website using animation on page loads.
                        // the problem is a lot animations has transfrom, opacity etc.
                        // This break the system and can't get real value.
                        // So I will fix this issue : ).
                        animation_fill_mode = el.css("animationFillMode");

                        // Disable it until we get real value.
                        if(animation_fill_mode == 'forwards' || animation_fill_mode == 'both'){

                            // Set none for animation-fill-mode and be sure. using promise.
                            $.when(el.css("animationFillMode","none")).promise().always(function() {

                                // Continue after done.
                                returnValue = check_with_parents_last(el, css, value, comparison, animation_fill_mode);

                                if(returnValue === true){
                                    return false;
                                }

                            });

                        }else{

                            // Continue to last part.
                            returnValue = check_with_parents_last(el, css, value, comparison);

                            if(returnValue === true){
                                return false;
                            }

                        }

                    }else{

                        // Continue to last part.
                        returnValue = check_with_parents_last(el, css, value, comparison);

                        if(returnValue === true){
                            return false;
                        }

                    }

                });
                
                return returnValue;

            }


            // just an part of check_with_parents function.
            function check_with_parents_last(el, css, value, comparison, animation_fill_mode){

                var isVal = false;

                // Get CSS
                var cssValue = el.css(css);

                // If not none but and not have any transfrom.
                if(css == 'transfrom' && cssValue != 'none' && cssValue == 'matrix(1, 0, 0, 1, 0, 0)'){
                    cssValue = 'none';
                }

                if (comparison == '==') {

                    if (cssValue === value) {
                        if(animation_fill_mode !== undefined){el.css("animationFillMode",animation_fill_mode);}
                        return true;

                    }

                } else {

                    if (cssValue !== value) {
                        if(animation_fill_mode !== undefined){el.css("animationFillMode",animation_fill_mode);}
                        return true;

                    }

                }

                if(animation_fill_mode !== undefined){el.css("animationFillMode",animation_fill_mode);}
                return isVal;

            }



            // Hide contextmenu on scroll.
            var timerx = null;
            iframe.scroll(function() {

                if (iframe.find(".context-menu-active").length > 0) {
                    get_selected_element().contextMenu("hide");
                }

                if(timerx !== null) {
                    clearTimeout(timerx);        
                }

                if(is_content_selected()){

                    // Set outline border while scrolling if its is fixed.
                    // Need to reflesh the position on scrolling and this will make feel slow the editor.
                    if (check_with_parents(get_selected_element(), "position", "fixed", "==") === true) {

                        if (!mainBody.hasClass("yp-has-transform")){ // if not have.

                            body.addClass("yp-has-transform"); // add

                        }else{

                            // back to normal borders and update position. 
                            timerx = setTimeout(function(){

                                body.removeClass("yp-has-transform");

                                draw();

                            },250);

                        }

                    }

                }

            });

    
            // update tooltip while scrolling always
            var timer = null;
            iframe.on("scroll", iframe, function(evt){

                if(timer !== null) {
                    clearTimeout(timer);        
                }

                timer = setTimeout(function(){
                    if(is_content_selected()){
                        draw_tooltip();
                    }
                }, 120);

            });


            // Set As Background Image
            $(".yp_background_assets div").click(function() {
                $(".yp_background_assets div.active").removeClass("active");
                $(this).parent().parent().find(".yp-input").val($(this).data("url")).trigger("keyup");
                $(this).addClass("active");
                $("#background-repeat-group .yp-none-btn:not(.active),#background-size-group .yp-none-btn:not(.active)").trigger("click");
            });

            // Set Color
            $(".yp_flat_colors_area div,.yp_meterial_colors_area div,.yp_nice_colors_area div").click(function() {

                var element = $(this);
                var elementParent = element.parent();

                $(".yp_flat_colors_area,.yp_meterial_colors_area,.yp_nice_colors_area").find(".active").removeClass("active");
                elementParent.parent().parent().parent().find(".wqcolorpicker").val($(this).data("color")).trigger("change");
                $(this).addClass("active");

            });

            // Custom Blur Callback
            $(document).click(function(event) {

                if(!event.originalEvent){
                    return false;
                }

                var evenTarget = $(event.target);

                if (evenTarget.is(".wqcolorpicker")) {
                    gui_update();
                }

                if (evenTarget.is(".iris-picker") === false && evenTarget.is(".iris-square-inner") === false && evenTarget.is(".iris-square-handle") === false && evenTarget.is(".iris-slider-offset") === false && evenTarget.is(".iris-slider-offset .ui-slider-handle") === false && evenTarget.is(".iris-picker-inner") === false && evenTarget.is(".wqcolorpicker") === false) {
                    $(".iris-picker").hide();
                    gui_update();
                }

                if (evenTarget.is('.yp_bg_assets') === false && evenTarget.is('.yp-none-btn') === false && evenTarget.is('.yp-bg-img-btn') === false && $(".yp_background_assets:visible").length > 0) {
                    $(".yp_background_assets").hide();
                    $(".yp-bg-img-btn").removeClass("active");
                    gui_update();
                }

                if (evenTarget.is('.yp-flat-c') === false && evenTarget.is('.yp-flat-colors') === false && $(".yp_flat_colors_area:visible").length > 0) {
                    $(".yp_flat_colors_area").hide();
                    $(".yp-flat-colors").removeClass("active");
                    gui_update();
                }

                if (evenTarget.is('.yp-meterial-c') === false && evenTarget.is('.yp-meterial-colors') === false && $(".yp_meterial_colors_area:visible").length > 0) {
                    $(".yp_meterial_colors_area").hide();
                    $(".yp-meterial-colors").removeClass("active");
                    gui_update();
                }

                if (evenTarget.is('.yp-nice-c') === false && evenTarget.is('.yp-nice-colors') === false && $(".yp_nice_colors_area:visible").length > 0) {
                    $(".yp_nice_colors_area").hide();
                    $(".yp-nice-colors").removeClass("active");
                    gui_update();
                }

            });

            $("#yp-target-dropdown").on("click", function(e) {
                if (e.target !== this) {
                    return;
                }

                $("#target_background").trigger("click");
            });

            function add_similar_selectors(selector) {

                if (selector == '' || selector == '.' || selector == '#' || selector == ' ' || selector == '  ' || selector == get_current_selector() || selector == $("#yp-button-target-input").val()) {
                    return false;
                }

                if ($("#yp-target-dropdown li").length < 10) {

                    if (iframe.find(selector).length === 0) {
                        return false;
                    }

                    if ($("#" + get_id(selector)).length > 0) {
                        return false;
                    }

                    var selectorOrginal = selector;
                    var selectorParts;

                    if (selector.indexOf("::") != -1) {
                        selectorParts = selector.split("::");
                        selector = selectorParts[0] + "<b>::" + selectorParts[1] + "</b>";
                    } else if (selector.indexOf(":") != -1) {
                        selectorParts = selector.split(":");
                        selector = selectorParts[0] + "<b>:" + selectorParts[1] + "</b>";
                    }

                    var role = ' ';
                    if (selector.indexOf(" > ") != -1) {
                        role = ' > ';
                    }

                    selector = "<span style=\"color:#D70669\">" + selector.replace(new RegExp(role, "g"), '</span>' + role + '<span style="color:#D70669">') + "</span>";
                    selector = selector.replace(/<span style=\"(.*?)\">\#(.*?)<\/span>/g, '<span style="color:#6300FF">\#$2<\/span>');

                    $("#yp-target-dropdown").append("<li id='" + get_id(selectorOrginal) + "'>" + selector + " | " + get_tag_information(selectorOrginal) + "</li>");

                }

            }

            function css_editor_toggle(status) {

                if (status === true) {

                    if (mainBody.hasClass("yp-css-editor-active")) {
                        $(".yp-css-close-btn").trigger("click");
                    }
                    mainBody.removeClass("yp-clean-look");

                } else {
                    mainBody.toggleClass("yp-clean-look");
                    if (mainBody.hasClass("yp-css-editor-active")) {
                        mainBody.removeClass("yp-css-editor-active");

                        var ebtn = $(".css-editor-btn");
                        ebtn.attr("data-original-title",ebtn.attr("data-title"));

                        $("#leftAreaEditor").hide();
                    }
                    gui_update();
                }

            }

            function create_similar_selectors() {

                var selector;

                $("#yp-target-dropdown li").remove();

                if ($("#yp-button-target-input").val() == '') {

                    selector = get_current_selector();

                } else {

                    selector = $("#yp-button-target-input").val();

                }

                if (isUndefined(selector)) {
                    return false;
                }

                var max = 10;

                // adding all ids
                if (selector == '#') {
                    iframe.find("[id]").not(window.simple_not_selector).each(function(i, v){
                        if (i < max) {
                            add_similar_selectors("#" + $(this).attr('id'));
                        }else{
                            return false;
                        }
                    });
                    return false;
                }

                // adding all classes
                if (selector == '.') {
                    iframe.find("[class]").not(window.simple_not_selector).each(function(i, v) {
                        if (i < max) {
                            add_similar_selectors("." + $(this).attr('class'));
                        }else{
                            return false;
                        }
                    });
                    return false;
                }

                if (selector.indexOf("::") > -1) {
                    selector = selector.split("::")[0];
                } else if (selector.indexOf(":") > -1) {
                    selector = selector.split(":")[0];
                }

                if (selector == '  ' || selector == ' ' || selector == '') {
                    return false;
                }

                // Using prefix
                if (get_selector_array(selector).length > 0) {

                    var last = null;
                    var elsAll,rex;
                    var lastPart = get_selector_array(selector)[(get_selector_array(selector).length - 1)];
                    if (lastPart.indexOf(" ") == -1) {
                        last = lastPart;
                    }

                    if (last !== null){

                        var selectorY = $.trim(selector.replace(/\#$/g,"").replace(/\.$/g,""));

                        // adding all ids
                        if (last == '#') {
                            iframe.find(selectorY).find("[id]").not(window.simple_not_selector).each(function(i, v) {
                                if (i < max) {
                                    add_similar_selectors(selector + $(this).attr('id'));
                                }else{
                                    return false;
                                }
                            });
                            return false;
                        }

                        // adding all classes
                        if (last == '.') {
                            iframe.find(selectorY).find("[class]").not(window.simple_not_selector).each(function(i, v) {
                                if (i < max) {
                                    add_similar_selectors(selector + $(this).attr('class'));
                                }else{
                                    return false;
                                }
                            });
                            return false;
                        }

                        // For Classes
                        if (last.indexOf(".") != -1){

                            elsAll = iframe.find("[class^='" + last.replace(/\./g, '') + "']").not(window.simple_not_selector);
                            rex = new RegExp("^" + last.replace(/\./g, '') + "(.+)");

                            elsAll.each(function(){

                                var classes = $(this).attr('class').split(' ');

                                for (var i = 0; i < classes.length; i++) {

                                    var matches = rex.exec(classes[i]);

                                    if (matches !== null) {
                                        var Foundclass = matches[1];
                                        add_similar_selectors(selector + Foundclass);
                                    }

                                }

                            });

                        }

                        // For ID
                        if (last.indexOf("#") != -1){

                            elsAll = iframe.find("[id^='" + last.replace(/\#/g, '') + "']").not(window.simple_not_selector);
                            rex = new RegExp("^" + last.replace(/\#/g, '') + "(.+)");

                            elsAll.each(function(){

                                var ids = $(this).attr('id').split(' ');

                                for (var i = 0; i < ids.length; i++) {

                                    var matches = rex.exec(ids[i]);

                                    if (matches !== null) {
                                        var Foundclass = matches[1];
                                        add_similar_selectors(selector + Foundclass);
                                    }

                                }

                            });

                        }

                    }else{
                        add_similar_selectors(selector);
                    }

                }

                // Adding childrens.
                var childrens = iframe.find(selector).find("*").not(window.simple_not_selector);

                if (childrens.length === 0) {
                    return false;
                }

                childrens.each(function(i) {
                    if(i < max){
                        add_similar_selectors(selector + " " + get_best_class($(this)));
                    }else{
                        return false;
                    }
                });

            }

            $(document).on("click", "#yp-target-dropdown li", function() {

                $("#yp-button-target-input").val($(this).text().split(" |")[0]).trigger("keyup").trigger("focus");

                $(".yp-button-target").trigger("click");

            });

            // Custom Selector
            $(".yp-button-target").click(function(e) {

                if ($(e.target).hasClass("yp-button-target-input")) {
                    return false;
                }

                if (iframe.find(".context-menu-active").length > 0) {
                    get_selected_element().contextMenu("hide");
                }

                var element = $(this);
                var selector;

                // if Search tool is closed
                if (!element.hasClass("active") && body.hasClass("yp-pressed-enter-key") === false) {

                    body.addClass("yp-target-active");
                    element.removeClass("active");

                    selector = get_current_selector();

                    if (body.attr("data-yp-selector") == ':hover') {
                        selector = selector + ":hover";
                    }

                    if (body.attr("data-yp-selector") == ':focus') {
                        selector = selector + ":focus";
                    }

                    if (body.attr("data-yp-selector") == ':link') {
                        selector = selector + ":link";
                    }

                    if (body.attr("data-yp-selector") == ':active') {
                        selector = selector + ":active";
                    }

                    if (body.attr("data-yp-selector") == ':visited') {
                        selector = selector + ":visited";
                    }

                    if (isUndefined(selector)) {
                        selector = '.';
                    }

                    $("#yp-button-target-input").trigger("focus").val(selector).trigger("keyup");

                    create_similar_selectors();

                } else {

                    selector = $("#yp-button-target-input").val();

                    if (selector == '' || selector == ' ') {
                        element.addClass("active");
                        body.removeClass("yp-target-active");
                    }

                    // Be sure hover and focus to last because just support hover&focus in last.
                    var hoverPosition = selector.match(/:hover(.*?)$/g);
                    var focusPosition = selector.match(/:focus(.*?)$/g);
                    var visitedPosition = selector.match(/:visited(.*?)$/g);
                    var activePosition = selector.match(/:active(.*?)$/g);
                    var linkPosition = selector.match(/:link(.*?)$/g);

                    if(hoverPosition !== null){
                        hoverPosition = hoverPosition.toString().trim().replace(/:hover/g,'').trim().length;
                    }else{
                        hoverPosition = 0;
                    }

                    if(focusPosition !== null){
                        focusPosition = focusPosition.toString().trim().replace(/:focus/g,'').trim().length;
                    }else{
                        focusPosition = 0;
                    }

                    if(visitedPosition !== null){
                        visitedPosition = visitedPosition.toString().trim().replace(/:visited/g,'').trim().length;
                    }else{
                        visitedPosition = 0;
                    }

                    if(activePosition !== null){
                        activePosition = activePosition.toString().trim().replace(/:active/g,'').trim().length;
                    }else{
                        activePosition = 0;
                    }

                    if(linkPosition !== null){
                        linkPosition = linkPosition.toString().trim().replace(/:link/g,'').trim().length;
                    }else{
                        linkPosition = 0;
                    }

                    var selectorNew = selector.replace(/:hover/g, '').replace(/:focus/g, '').replace(/:link/g, '').replace(/:visited/g, '').replace(/:active/g, '');


                    if (iframe.find(selectorNew).length > 0 && selectorNew != '*' && hoverPosition === 0 && focusPosition === 0) {

                        if (iframe.find(selector).hasClass("yp-selected")) {
                            get_selected_element().addClass("yp-will-selected");
                        }

                        set_selector(space_cleaner(selector),null);

                        // selected element
                        var selectedElement = iframe.find(selectorNew);

                        // scroll to element if not visible on screen.
                        var height = parseInt($(window).height() / 2);
                        var selectedHeight = parseInt(selectedElement.height() / 2);
                        if (selectedHeight < height) {
                            var scrollPosition = selectedHeight + selectedElement.offset().top - height;
                            iframe.scrollTop(scrollPosition);
                        }

                        element.addClass("active");
                        body.removeClass("yp-target-active");

                    } else if (selectorNew != '' && selectorNew != ' '){

                        $("#yp-button-target-input").css("color", "red");

                        element.removeClass("active");
                        body.addClass("yp-target-active");

                    }

                }

            });

            // Custom Selector Close.
            $("#target_background").click(function() {

                body.removeClass("yp-target-active");
                $("#yp-button-target-input").val("");
                $(".yp-button-target").trigger("click");

            });

            // Custom Selector Keyup
            $("#yp-button-target-input").keyup(function(e) {

                if($(this).val().length > 1 || $(this).val() == '#' || $(this).val() == "."){
                    create_similar_selectors();
                }

                if (e.keyCode != 13){
                    $(this).attr("style", "");
                }

                // Enter
                if (e.keyCode == 13) {
                    body.addClass("yp-pressed-enter-key");
                    $(".yp-button-target").trigger("click");
                    body.removeClass("yp-pressed-enter-key");
                    return false;
                }

            });

            // Selector Color Red Remove.
            $("#yp-button-target-input").keydown(function(e) {

                if (e.keyCode != 13){
                    $(this).attr("style", "");
                }

            });

            var wIris = 237;
            if ($(window).width() < 1367) {
                wIris = 210;
            }

            // iris plugin.
            $('.yp-select-bar > ul > li > div > div > div > div > .wqcolorpicker').cs_iris({
                hide: true,
                width: wIris
            });

            // iris plugin.
            $('.yp-select-bar .yp-advanced-option .wqcolorpicker').cs_iris({
                hide: true,
                width: wIris
            });

            // Update responsive note
            function update_responsive_size_notice() {

                if (mainBody.hasClass("yp-responsive-device-mode") === false) {
                    return false;
                }

                var s = $("#iframe").width();
                var device = '';

                // Set device size.
                $(".device-size").text(s);

                if ($(".media-control").attr("data-code") == 'max-width') {

                    device = '(phones)';

                    if (s >= 375) {
                        device = '(Large phones)';
                    }

                    if (s >= 414) {
                        device = '(tablets & landscape phones)';
                    }

                    if (s >= 736) {
                        device = '(tablets)';
                    }

                    if (s >= 768) {
                        device = '(small desktops & tablets and phones)';
                    }

                    if (s >= 992) {
                        device = '(medium desktops & tablets and phones)';
                    }

                    if (s >= 1200) {
                        device = '(large desktops & tablets and phones)';
                    }

                } else {

                    device = '(phones & tablets and desktops)';

                    if (s >= 375) {
                        device = '(phones & tablets and desktops)';
                    }

                    if (s >= 414) {
                        device = '(large phones & tablets and desktops)';
                    }

                    // Not mobile.
                    if (s >= 736) {
                        device = '(landscape phones & tablets and desktops)';
                    }

                    // Not tablet
                    if (s >= 768) {
                        device = '(desktops)';
                    }

                    // Not small desktop
                    if (s >= 992) {
                        device = '(medium & large desktops)';
                    }

                    // Not medium desktop
                    if (s >= 1200) {
                        device = '(large desktops)';
                    }

                }

                // Set device name
                $(".device-name").text(device);

            }

            // Smart insert default values for options.
            function insert_default_options() {

                if (is_content_selected() === false) {
                    return false;
                }

                // current options
                var options = $(".yp-editor-list > li.active:not(.yp-li-about) .yp-option-group");

                // delete all cached data.
                $("li[data-loaded]").removeAttr("data-loaded");

                // UpData current active values.
                if (options.length > 0) {
                    options.each(function() {

                        if ($(this).attr("id") != "background-parallax-group" && $(this).attr("id") != "background-parallax-speed-group" && $(this).attr("id") != "background-parallax-x-group" && $(this).attr("id") != "background-position-group") {

                            var check = 1;

                            if ($(this).attr("id") == 'animation-duration-group' && is_animate_creator() === true) {
                                check = 0;
                            }

                            if (check == 1) {
                                set_default_value(get_option_id(this));
                            }

                        }
                    });
                }

                // cache to loaded data.
                options.parent().attr("data-loaded", "true");

                update_customizing_element();

            }

            $(".input-autocomplete").each(function() {

                // Get data by select
                var data = [];
                $(this).parent().find("select option").each(function() {
                    data.push($(this).text());
                });

                var id = $(this).parent().parent().attr("data-css");

                // Autocomplete script
                $(this).autocomplete({
                    source: data,
                    delay: 0,
                    minLength: 0,
                    autoFocus: true,
                    close: function(event, ui) {

                        $(".active-autocomplete-item").removeClass("active-autocomplete-item");
                        $(this).removeClass("active");

                        setTimeout(function(){
                            mainBody.removeClass("autocomplete-active");
                        },300);

                        if ($(this).parent().find('select option:contains(' + $(this).val() + ')').length) {
                            $(this).val($(this).parent().find('select option:contains(' + $(this).val() + ')').val());
                        }

                    },
                    open: function(event, ui) {

                        window.openVal = $(this).val();

                        $(this).addClass("active");
                        mainBody.addClass("autocomplete-active");

                        var current = $(this).val();

                        var fontGoogle = null;

                        // Getting first font family and set active if yp has this font family.
                        if (id == 'font-family') {
                            if (current.indexOf(",") != -1) {
                                var currentFont = $.trim(current.split(",")[0]);
                                currentFont = currentFont.replace(/'/g, "").replace(/"/g, "").replace(/ /g, "").toLowerCase();

                                if ($('#yp-' + id + '-data option[data-text="' + currentFont + '"]').length > 0) {
                                    fontGoogle = $('#yp-' + id + '-data option[data-text="' + currentFont + '"]').text();
                                }

                            }
                        }

                        if (fontGoogle === null){
                            if ($('#yp-' + id + '-data option[value="' + current + '"]').length > 0) {
                                current = $('#yp-' + id + '-data option[value="' + current + '"]').text();
                            }
                        } else {
                            current = fontGoogle;
                        }

                        if ($(this).parent().find(".autocomplete-div").find('li').filter(function() {
                                return $.text([this]) === current;
                            }).length == 1) {

                            $(".active-autocomplete-item").removeClass("active-autocomplete-item");
                            if ($(".active-autocomplete-item").length === 0) {

                                $(this).parent().find(".autocomplete-div").find('li').filter(function() {
                                    return $.text([this]) === current;
                                }).addClass("active-autocomplete-item");

                            }

                        }

                        // Scroll
                        if ($(".active-autocomplete-item").length > 0) {
                            $(this).parent().find(".autocomplete-div").find('li.ui-state-focus').removeClass("ui-state-focus");
                            var parentDiv = $(this).parent().find(".autocomplete-div li.active-autocomplete-item").parent();
                            var activeEl = $(this).parent().find(".autocomplete-div li.active-autocomplete-item");

                            parentDiv.scrollTop(parentDiv.scrollTop() + activeEl.position().top);
                        }

                        // Update font-weight family
                        $("#yp-autocomplete-place-font-weight ul li").css("fontFamily", $("#yp-font-family").val());


                        // Font Weight
                        if (id == 'font-weight') {

                            $(".autocomplete-div li").each(function() {
                                
                                // Light 300 > 300
                                var v = Math.abs(number_filter($(this).text()));
                                $(this).css("fontWeight", v);

                            });

                        }

                        if(id == 'font-weight' || id == 'font-family'){
                            load_near_fonts($(this).parent().find(".autocomplete-div"));
                        }

                        // Text shadow
                        if (id == 'text-shadow') {

                            $(".autocomplete-div li").each(function() {

                                if ($(this).text() == 'Basic Shadow') {
                                    $(this).css("textShadow", 'rgba(0, 0, 0, 0.3) 0px 1px 1px');
                                }

                                if ($(this).text() == 'Shadow Multiple') {
                                    $(this).css("textShadow", 'rgb(255, 255, 255) 1px 1px 0px, rgb(170, 170, 170) 2px 2px 0px');
                                }

                                if ($(this).text() == 'Anaglyph') {
                                    $(this).css("textShadow", 'rgb(255, 0, 0) -1px 0px 0px, rgb(0, 255, 255) 1px 0px 0px');
                                }

                                if ($(this).text() == 'Emboss') {
                                    $(this).css("textShadow", 'rgb(255, 255, 255) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px');
                                }

                                if ($(this).text() == 'Neon') {
                                    $(this).css("textShadow", 'rgb(255, 255, 255) 0px 0px 2px, rgb(255, 255, 255) 0px 0px 4px, rgb(255, 255, 255) 0px 0px 6px, rgb(255, 119, 255) 0px 0px 8px, rgb(255, 0, 255) 0px 0px 12px, rgb(255, 0, 255) 0px 0px 16px, rgb(255, 0, 255) 0px 0px 20px, rgb(255, 0, 255) 0px 0px 24px');
                                }

                                if ($(this).text() == 'Outline') {
                                    $(this).css("textShadow", 'rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) -1px 0px 1px');
                                }

                            });

                        }

                    },

                    appendTo: "#yp-autocomplete-place-" + $(this).parent().parent().attr("id").replace("-group", "").toString()
                }).click(function() {
                    $(this).autocomplete("search", "");
                });

            });

            $(".yp-responsive-btn").click(function() {

                if (mainBody.hasClass("yp-css-editor-active")) {
                    $(".yp-css-close-btn").trigger("click");
                }

            });

            // Responsive Helper: tablet
            $(".yp-responsive-btn").click(function() {

                if ($(this).hasClass("active")) {
                    body.removeClass("yp-responsive-device-mode");
                    $(this).addClass("active");
                    $("#iframe").removeAttr("style");
                    insert_default_options();
                    update_responsive_size_notice();
                    draw();
                } else {
                    body.addClass("yp-responsive-device-mode");
                    $(this).removeClass("active");
                    insert_default_options();
                    update_responsive_size_notice();
                    draw();
                }

                if(body.hasClass("yp-animate-manager-active")){
                    animation_manager();
                }

            });

            // Reset Button
            $(".yp-button-reset").click(function() {

                if (is_animate_creator()) {
                    if (!confirm(l18_closeAnim)) {
                        return false;
                    } else {
                        yp_anim_cancel();
                    }
                }

                var p = $(".yp-ul-all-pages-list").find(".active").text();
                var t = $(".yp-ul-single-list").find(".active").text();

                if ($(".yp-ul-all-pages-list").find(".active").length > 0) {
                    l18_reset = "You are sure to reset changes on <strong>'"+p+"'</strong> page?";
                } else if ($(".yp-ul-single-list").find(".active").length > 0) {
                    l18_reset = "You are sure to reset changes on <strong>'"+t+"'</strong> template?";
                } else {
                    l18_reset = "You are sure to reset all <strong>global changes</strong>?";
                    
                }

                var link = $(".yp-source-page-link").parent("a").attr("href");

                var l18_reset_text = "May be you need to more control? You can manage all style sources from <a href='"+link+"' target='_blank'>this page</a>.";                

                swal({
                  title: l18_reset,
                  text: l18_reset_text,
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Yes, Reset!",
                  closeOnConfirm: true,
                  animation: false,
                  customClass: 'yp-reset-popup',
                  html: true
                },function(){

                    iframe.find(".yp_current_styles").remove();

                    // Clean Editor Value.
                    editor.setValue('');

                    // delete undo history.
                    editor.getSession().setUndoManager(new ace.UndoManager());

                    // Clean CSS Data
                    iframe.find("#yp-css-data-full").empty();

                    // Reset Parallax.
                    iframe.find(".yp-parallax-disabled").removeClass("yp-parallax-disabled");

                    // Update Changes.
                    if (is_content_selected()) {

                        insert_default_options();

                        draw();

                    }

                    // Option Changed
                    option_change();

                    // Update draggable after reset
                    var el = iframeBody.find(".yp-selected");
                    if(el.length > 0){

                        if(el.css("position") == 'static'){
                            el.css("position","relative");
                            iframeBody.find(".yp-selected-others").css("position","relative");
                        }

                    }

                });

            });

            // Install All Options Types.
            // Installing and setting default value to all.
            $(".yp-slider-option").each(function() {
                slider_option(get_option_id(this), $(this).data("decimals"), $(this).data("pxv"), $(this).data("pcv"), $(this).data("emv"));
            });

            $(".yp-radio-option").each(function() {
                radio_option(get_option_id(this));
            });

            $(".yp-color-option").each(function() {
                color_option(get_option_id(this));
            });

            $(".yp-input-option").each(function() {
                input_option(get_option_id(this));
            });

            // Updating slider by input value.
            function update_slide_by_input(element,value,prefix) {

                var elementParent = element.parent().parent().parent();
                var range;

                if(value === false){
                    value = element.parent().find(".yp-after-css-val").val();
                    prefix = element.parent().find(".yp-after-prefix").val();
                }

                var slide = element.parent().parent().find(".wqNoUi-target");

                // Update PX
                if (prefix == 'px') {
                    range = elementParent.data("px-range").split(",");
                }

                // Update %.
                if (prefix == '%') {
                    range = elementParent.data("pc-range").split(",");
                }

                // Update EM.
                if (prefix == 'em') {
                    range = elementParent.data("em-range").split(",");
                }

                // Update S.
                if (prefix == 's' || prefix == '.s') {
                    range = elementParent.data("em-range").split(",");
                }

                // min and max values
                if (range === undefined || range === false) {
                    return false;
                }

                var min = parseInt(range[0]);
                var max = parseInt(range[1]);

                if (value < min) {
                    min = value;
                }

                if (value > max) {
                    max = value;
                }

                if (isNaN(min) === false && isNaN(max) === false && isNaN(value) === false){

                    slide.wqNoUiSlider({
                        range: {
                            'min': parseInt(min),
                            'max': parseInt(max)
                        },

                        start: value
                    }, true);

                }

            }

            // process CSS before open CSS editor.
            $("body:not(.yp-css-editor-active) .css-editor-btn").hover(function() {
                if (!mainBody.hasClass("yp-css-editor-active")) {
                    process(false, false, false);
                }
            });

            // Hide CSS Editor.
            $(".css-editor-btn,.yp-css-close-btn").click(function() {

                if(body.hasClass("yp-animate-manager-active")){
                    $(".animation-manager-btn.active").trigger("click");
                }

                // delete fullscreen editor
                if (body.hasClass("yp-fullscreen-editor")) {
                    body.removeClass("yp-fullscreen-editor");
                }

                if ($("#leftAreaEditor").css("display") == 'none') {

                    // No selected
                    if (!is_content_selected()) {
                        editor.setValue(get_clean_css(true));
                        editor.focus();
                        editor.execCommand("gotolineend");
                    } else {
                        insert_rule(null, 'a', 'a', '');
                        var cssData = get_clean_css(false);
                        var goToLine = cssData.split("a:a")[0].split(/\r\n|\r|\n/).length;
                        cssData = cssData.replace(/a:a !important;/g, "");
                        cssData = cssData.replace(/a:a;/g, "");
                        editor.setValue(cssData);
                        editor.resize(true);
                        setTimeout(function(){
                            editor.scrollToLine(goToLine, true, false);
                        },2);
                        editor.focus();
                        if (mainBody.hasClass("yp-responsive-device-mode")) {
                            editor.gotoLine(goToLine, 2, true);
                        } else {
                            editor.gotoLine(goToLine, 1, true);
                        }
                    }

                    $("#cssData,#cssEditorBar,#leftAreaEditor").show();
                    mainBody.addClass("yp-css-editor-active");
                    
                    var ebtn = $(".css-editor-btn");
                    var title = ebtn.attr("data-original-title"); // Save
                    ebtn.attr("data-title",title); // save as data
                    ebtn.attr("data-original-title",""); // remove title

                    iframeBody.trigger("scroll");

                } else {

                    // CSS To data
                    process(true, false, false);

                }

                // Update All.
                draw();

            });

            // Blur: Custom Slider Value
            $(".yp-after-css-val,.yp-after-prefix").on("keydown keyup",function(e) {

                if(!e.originalEvent){
                    return false;
                }

                var id = $(this).parents(".yp-option-group").attr("data-css");
                var thisContent = $("#" + id + "-group").parent(".yp-this-content");
                var lock = thisContent.find(".lock-btn.active").length;
                var lockedIdArray = [];

                if(lock){
                    thisContent.find(".yp-option-group").each(function(){
                        if($(this).attr("data-css") != id){
                            lockedIdArray.push($(this).attr("data-css"));
                        }
                    });
                }

                var value = $(this).parent().find(".yp-after-css-val").val();
                var prefix = $(this).parent().find(".yp-after-prefix").val();

                // Self
                update_slide_by_input($(this),false);

                // others
                if(lock){

                    for(var y = 0;y < lockedIdArray.length; y++){
                        $("#" + lockedIdArray[y]+"-value").val(value);
                        $("#" + lockedIdArray[y]+"-after").val(prefix);
                        update_slide_by_input($("#" + lockedIdArray[y]+"-value"),value,prefix);
                        slide_action($("#yp-" + lockedIdArray[y]), lockedIdArray[y], true, false);
                    }

                    option_change();

                }

            });


            // Call function.
            gui_update();


            // select only single element
            function single_selector(selector) {

                var customClass = 'yp-selected';
                if(mainBody.hasClass("yp-control-key-down") && is_content_selected()){
                    customClass = 'yp-multiple-selected';
                }

                // Clean
                selector = left_trim(selector, "htmlbody ");
                selector = left_trim(selector, "html ");
                selector = left_trim(selector, "body ");

                var selectorArray = get_selector_array(selector);
                var i = 0;
                var indexOf = 0;
                var selectorPlus = '';

                for (i = 0; i < selectorArray.length; i++) {

                    if (i > 0) {
                        selectorPlus += window.separator + selectorArray[i];
                    } else {
                        selectorPlus += selectorArray[i];
                    }

                    if (iframe.find(selectorPlus).length > 1) {

                        iframe.find(selectorPlus).each(function(){

                            if (selectorPlus.substr(selectorPlus.length - 1) != ')') {

                                if ($(this).parent().length > 0) {

                                    indexOf = 0;

                                    $(this).parent().children().each(function() {

                                        indexOf++;

                                        if ($(this).find("."+customClass).length > 0 || $(this).hasClass((customClass))) {

                                            selectorPlus = selectorPlus + ":nth-child(" + indexOf + ")";

                                        }

                                    });

                                }

                            }

                        });

                    }

                }


                // Clean no-need nth-childs.
                if(selectorPlus.indexOf(":nth-child") != -1){

                    // Selector Array
                    selectorArray = get_selector_array(selectorPlus);

                    // Each all selector parts
                    for(i = 0; i < selectorArray.length; i++){

                        // Get previous parts of selector
                        var prevAll = get_previous_item(selectorArray,i).join(" ");

                        // Gext next parts of selector
                        var nextAll = get_next_item(selectorArray,i).join(" ");

                        // check the new selector
                        var selectorPlusNew = prevAll + window.separator + selectorArray[i].replace(/:nth-child\((.*?)\)/i,'') + window.separator + nextAll;

                        // clean
                        selectorPlusNew = space_cleaner(selectorPlusNew);

                        // Add " > " to last part of selector for be sure everything works fine.
                        if(iframe.find(selectorPlusNew).length > 1){
                            selectorPlusNew = selectorPlusNew.replace(/(?=[^ ]*$)/i,' > ');
                        }

                        // Check the selector without nth-child and be sure have only 1 element.
                        if(iframe.find(selectorPlusNew).length == 1){
                            selectorArray[i] = selectorArray[i].replace(/:nth-child\((.*?)\)/i,'');
                        }

                    }

                    // Array to spin, and clean selector.
                    selectorPlus = space_cleaner(selectorArray.join(" "));

                }


                // Add > symbol to last if selector finding more element than one.
                if(iframe.find(selectorPlus).length > 1){
                    selectorPlus = selectorPlus.replace(/(?=[^ ]*$)/i,' > ');
                }


                // Ready.
                return space_cleaner(selectorPlus);

            }


            function get_previous_item(arr,current){

                var result = [];

                for(var i = 0; i < arr.length; i++){

                    if(i < current){

                        result.push(arr[i]);

                    }

                }

                return result;

            }

            function get_next_item(arr,current){

                var result = [];

                for(var i = 0; i < arr.length; i++){

                    if(i > current){

                        result.push(arr[i]);

                    }

                }

                return result;

            }


            /* ---------------------------------------------------- */
            /* Set context menu options.                            */
            /* ---------------------------------------------------- */
            $.contextMenu({

                events: {

                    // Draw Again Borders, Tooltip After Contextmenu Hide.
                    hide: function(opt) {

                        body.removeClass("yp-contextmenuopen");

                        draw();

                    },

                    // if contextmenu show; update some options.
                    show: function() {

                        // Disable contextmenu on animate creator.
                        if (is_animate_creator()) {
                            get_selected_element().contextMenu("hide");
                        }

                        var selector = get_current_selector();

                        var elementP = iframe.find(selector).parent();

                        if (elementP.length > 0 && elementP[0].nodeName.toLowerCase() != "html") {
                            $(".yp-contextmenu-parent").removeClass("yp-disable-contextmenu");
                        } else {
                            $(".yp-contextmenu-parent").addClass("yp-disable-contextmenu");
                        }

                        body.addClass("yp-contextmenuopen");

                    }

                },

                // Open context menu only if a element selected.
                selector: 'body.yp-content-selected .yp-selected,body.yp-content-selected.yp-selected',
                callback: function(key, options) {

                    body.removeClass("yp-contextmenuopen");

                    var selector = get_current_selector();

                    // Context Menu: Parent
                    if (key == "parent") {

                        // If Disable, Stop.
                        if ($(".yp-contextmenu-parent").hasClass("yp-disable-contextmenu")) {
                            return false;
                        }

                        // add class to parent.
                        get_selected_element().parent().addClass("yp-will-selected");

                        // clean
                        clean();

                        // Get parent selector.
                        var parentSelector = $.trim(get_parents(iframe.find(".yp-will-selected"), "default"));

                        // Set Selector
                        set_selector(parentSelector,null);

                    }

                    // Context Menu: Hover
                    if (key == "hover" || key == "focus" || key == "link" || key == "visited" || key == "active") {

                        selector = selector.replace(/:(?!hover|focus|active|link|visited)/g,"YP_DOTTED_PREFIX");

                        if (!$(".yp-contextmenu-" + key).hasClass("yp-active-contextmenu")){
                            if (selector.indexOf(":") == -1) {
                                selector = selector + ":" + key;
                            } else {
                                selector = selector.split(":")[0] + ":" + key;
                            }
                        } else {
                            selector = selector.split(":")[0];
                        }

                        selector = selector.replace(/YP_DOTTED_PREFIX/g,":");

                        set_selector(selector,null);

                    }

                    if (key == "writeCSS") {

                        if (mainBody.hasClass("yp-css-editor-active")) {
                            $(".css-editor-btn").trigger("click");
                        }

                        $(".css-editor-btn").trigger("click");

                    }

                    // Select Just It
                    if (key == 'selectjustit') {

                        mainBody.addClass("yp-select-just-it");

                        var currentSelector = get_current_selector();                      

                        if(iframe.find(currentSelector).length > 1){

                            selector = get_parents(null, "sharp");

                            var selectorPlus = single_selector(selector);

                            if (iframe.find(selectorPlus).length !== 0) {
                                set_selector(selectorPlus,null);
                            }

                        }

                        mainBody.removeClass("yp-select-just-it");

                    }
                    /* Select just it functions end here */


                    if(key == 'resetit'){
                        reset_selected_element(false);
                    }

                    if(key == 'reset-with-childs'){
                        reset_selected_element(true);
                    }

                    // leave Selected element.
                    if (key == 'close') {
                        clean();
                        element_leave();
                        gui_update();
                    }

                    // toggle selector editor.
                    if (key == "editselector") {
                        $(".yp-button-target").trigger("click");
                    }

                },

                // Content menu elements.
                items: {
                    "hover": {
                        name: ":Hover",
                        className: "yp-contextmenu-hover"
                    },
                    "focus": {
                        name: ":Focus",
                        className: "yp-contextmenu-focus"
                    },
                    "sep1": "---------",
                    "parent": {
                        name: "Parent Element",
                        className: "yp-contextmenu-parent"
                    },
                    "editselector": {
                        name: "Edit Selector",
                        className: "yp-contextmenu-selector-edit"
                    },
                    "writeCSS": {
                        name: "Write CSS",
                        className: "yp-contextmenu-type-css"
                    },
                    "selectjustit": {
                        name: "Select just it",
                        className: "yp-contextmenu-select-it"
                    },
                    "reset": {
                        name: "Reset Styles",
                        items:{
                            "resetit": {
                                name: "The Element",
                                className: "yp-contextmenu-reset-it"
                            },
                            "reset-with-childs": {
                                name: "Childs Elements",
                                className: "yp-contextmenu-reset-childs"
                            },
                        },
                    },
                    "close": {
                        name: "Leave",
                        className: "yp-contextmenu-close"
                    }
                }

            });

    

            /* ---------------------------------------------------- */
            /* Resize.                                              */
            /* Dynamic resize yellow pencil panel                   */
            /* ---------------------------------------------------- */
            function gui_update() {

                // Variables
                var topBarHeight,height,heightLitte,footerHeight,topPadding,topHeightBar;

                // update.
                window.scroll_width = get_scroll_bar_width();

                // top margin for matgin.
                var topMargin = 0;
                if (mainBody.hasClass("yp-metric-disable") === false || mainBody.hasClass("yp-responsive-device-mode")) {
                    topMargin = 31;
                }

                if(mainBody.hasClass("yp-html-mod-active")){
                    topMargin = topMargin + 42;
                }

                // Right menu fix.
                if (iframe.height() > $(window).height() && mainBody.hasClass("yp-responsive-device-mode") === false) {
                    $(".yp-select-bar").css("marginRight", 8 + window.scroll_width + "px");
                } else if (topMargin === 0) {
                    $(".yp-select-bar").css("marginRight", "8px");
                } else if (topMargin > 0 && iframe.height() + topMargin > $(window).height()) {
                    $(".yp-select-bar").css("marginRight", 8 + window.scroll_width + "px");
                }

                // Maximum Height.
                var maximumHeight = $(window).height() - 24 - topMargin;

                // Difference size for 790 and more height.
                if ($(window).height() > 790) {
                    topBarHeight = 46;
                } else {
                    topBarHeight = 43;
                }

                // Resize. If no selected menu showing.
                if ($(".yp-no-selected").css("display") == "block") {

                    height = $(".yp-no-selected").height() + 140;

                    if (height <= maximumHeight) {
                        $(".yp-select-bar").height(height);
                        $(".yp-editor-list").height(height - 45);
                    } else {
                        $(".yp-select-bar").height(maximumHeight);
                        $(".yp-editor-list").height(maximumHeight - 45);
                    }

                    // If any options showing.
                } else if ($(".yp-this-content:visible").length > 0) {

                    height = $(".yp-this-content:visible").parent().height();

                    if (height <= maximumHeight) {
                        if (window.chrome) {
                            height = height + 116;
                        } else {
                            height = height + 116;
                        }
                        heightLitte = height - 45;
                    }

                    if ($(window).height() < 700) {
                        height = height - 3;
                    }

                    if (height <= maximumHeight) {
                        $(".yp-select-bar").height(height - 2);
                        $(".yp-editor-list").height(heightLitte);
                    } else {
                        $(".yp-select-bar").height(maximumHeight);
                        $(".yp-editor-list").height(maximumHeight - 45);
                    }

                } else { // If Features list showing.


                        if ($(window).height() > 790) {
                            footerHeight = 103;
                        } else if ($(window).height() > 700) {
                            footerHeight = 113;
                        } else {
                            footerHeight = 33;
                        }


                    topPadding = (($(".yp-editor-list > li").length - 2) * topBarHeight) + footerHeight;

                    topHeightBar = $(".yp-editor-top").height() + topPadding;

                    if (topHeightBar <= maximumHeight) {
                        $(".yp-select-bar").height(topHeightBar);
                        $(".yp-editor-list").height(topPadding);
                    } else {
                        $(".yp-select-bar").height(maximumHeight);
                        $(".yp-editor-list").height(topPadding);
                    }

                }

            }

            // Element Picker Helper
            $(".yp-element-picker").click(function() {
                mainBody.toggleClass("yp-element-picker-active");
                $(this).toggleClass("active");
            });

            // ruler helper.
            mainDocument.on("mousemove mousedown", function(e){

                if (mainBody.hasClass("yp-metric-disable") === false) {

                    var x = e.pageX;
                    var y = e.pageY;
                    var cx = e.clientX;
                    var cy = e.clientY;
                    var ww = $(window).width();
                    var wh = $(window).height();

                    if (mainBody.hasClass("yp-responsive-resizing")) {
                        y = y - 10;
                        x = x - 10;
                        cx = cx - 10;
                        cy = cy - 10;
                    }

                    if ($(this).find("#iframe").length > 0) {

                        if (body.hasClass("yp-responsive-device-mode")) {

                            if (mainBody.hasClass("yp-responsive-resizing")) {

                                // Min 320 W
                                if (cx < 320 + 48) {
                                    cx = 320 + 48;
                                }

                                // Max full-80 W
                                if (cx > ww - 80) {
                                    cx = ww - 80;
                                }

                                // Min 320 H
                                if (cy < 320 + 31) {
                                    cy = 320 + 31;
                                }

                                // Max full-80 H
                                if (cy > wh - 80) {
                                    cy = wh - 80;
                                }

                            }

                            $(".metric-top-border").attr("style", "left:" + cx + "px !important;display:block;margin-left:-1px !important;");
                            $(".metric-left-border").attr("style", "top:" + cy + "px !important;");
                            $(".metric-top-tooltip").attr("style", "top:" + cy + "px !important;display:block;");
                            $(".metric-left-tooltip").attr("style", "left:" + cx + "px !important;display:block;margin-left:1px !important;");

                            if (mainBody.hasClass("yp-responsive-resizing")) {
                                $(".metric-left-tooltip span").text(x + 10);
                                $(".metric-top-tooltip span").text(y + 10);
                            } else {
                                $(".metric-left-tooltip span").text(x);
                                $(".metric-top-tooltip span").text(y);
                            }

                        }

                    }

                    if ($(this).find("#iframe").length === 0) {

                        if (mainBody.hasClass("yp-responsive-resizing")) {

                            // Min 320 W
                            if (cx < 320) {
                                cx = 320;
                            }

                            // Max full W
                            if (cx > ww) {
                                cx = ww;
                            }

                            // Min 320 H
                            if (cy < 320) {
                                cy = 320;
                            }

                            // Max full H
                            if (cy > wh) {
                                cy = wh;
                            }

                        }

                        $(".metric-top-border").attr("style", "left:" + cx + "px !important;display:block;");
                        $(".metric-left-border").attr("style", "top:" + cy + "px !important;margin-top:30px;");
                        $(".metric-top-tooltip").attr("style", "top:" + cy + "px !important;display:block;margin-top:32px;");
                        $(".metric-left-tooltip").attr("style", "left:" + cx + "px !important;display:block;");

                        if (mainBody.hasClass("yp-responsive-resizing")) {
                            $(".metric-top-tooltip span").text(y + 10);
                            $(".metric-left-tooltip span").text(x + 10);
                        } else {
                            $(".metric-top-tooltip span").text(y);
                            $(".metric-left-tooltip span").text(x);
                        }

                    }

                }

            });

            iframe.on("mousemove", function(e) {

                if (mainBody.hasClass("yp-metric-disable") === false){

                    var element = $(e.target);

                    if (element.hasClass("yp-selected-tooltip") || element.hasClass("yp-selected-boxed-top") || element.hasClass("yp-selected-boxed-left") || element.hasClass("yp-selected-boxed-right") || element.hasClass("yp-selected-boxed-bottom") || element.hasClass("yp-edit-tooltip") || element.hasClass("yp-edit-menu") || element.hasClass("yp-edit-edit") || element.hasClass("yp-edit-style") || element.parent().hasClass("yp-selected-tooltip")) {
                        element = get_selected_element();
                    }

                    // CREATE SIMPLE BOX
                    var element_offset = element.offset();

                    if (isDefined(element_offset)) {

                        var topBoxesI = element_offset.top;
                        var leftBoxesI = element_offset.left;

                        if (leftBoxesI < 0) {
                            leftBoxesI = 0;
                        }

                        var widthBoxesI = element.outerWidth();
                        var heightBoxesI = element.outerHeight();

                        // Dynamic Box
                        if (iframe.find(".hover-info-box").length === 0) {
                            iframeBody.append("<div class='hover-info-box'></div>");
                        }

                        iframe.find(".hover-info-box").css("width", widthBoxesI).css("height", heightBoxesI).css("top", topBoxesI).css("left", leftBoxesI);

                    }

                    // Create box end.
                    if (is_resizing()) {
                        element = get_selected_element();
                    }

                    if (isUndefined(element_offset)) {
                        return false;
                    }

                    var topBoxes = element_offset.top;
                    var leftBoxes = element_offset.left;

                    if (leftBoxes < 0) {
                        leftBoxes = 0;
                    }

                    var widthBoxes = element.outerWidth(false);
                    var heightBoxes = element.outerHeight(false);

                    var bottomBoxes = topBoxes + heightBoxes;

                    if (iframe.find(".yp-size-handle").length === 0) {
                        iframeBody.append("<div class='yp-size-handle'>W : <span class='ypdw'></span> px<br>H : <span class='ypdh'></span> px</div>");
                    }

                    var w = element.css("width");
                    var h = element.css("height");

                    iframe.find(".yp-size-handle .ypdw").text(parseInt(w));
                    iframe.find(".yp-size-handle .ypdh").text(parseInt(h));

                    leftBoxes = leftBoxes + (widthBoxes / 2);

                    iframe.find(".yp-size-handle").css("top", bottomBoxes).css("bottom", "auto").css("left", leftBoxes).css("position", "absolute");

                    if (parseFloat(bottomBoxes) > (parseFloat($("body #iframe").height()) + parseFloat(iframe.scrollTop())) + 40) {

                        iframe.find(".yp-size-handle").css("bottom", "10px").css("top", "auto").css("left", leftBoxes).css("position", "fixed");

                    }

                }

            });

    
            $(window).resize(function(){
                setTimeout(function(){
                    gui_update();
                },5);
            });


            /* ---------------------------------------------------- */
            /* Element Selector Box Function                        */
            /* ---------------------------------------------------- */
            iframe.on("mouseover", iframe, function(evt){

               if ($(".yp-selector-mode.active").length > 0 && mainBody.hasClass("yp-metric-disable")){

                    // Element
                    var element = $(evt.target);

                    // Adding always class to last hovered element for some reasions.
                    iframe.find(".yp-recent-hover-element").removeClass("yp-recent-hover-element");

                    if (is_content_selected() === true && mainBody.hasClass("yp-control-key-down") === false) {
                        element.addClass("yp-recent-hover-element");
                    }

                    var elementClasses = element.attr("class");

                    // Multi selecting support
                    if (is_content_selected() === false) {
                        if (element.hasClass("yp-selected-tooltip")) {
                            clean();
                            return false;
                        }

                        if (element.parent().length > 0) {
                            if (element.parent().hasClass("yp-selected-tooltip")) {
                                clean();
                                return false;
                            }
                        }
                    }

                    // If not any yellow pencil element.
                    if (isDefined(elementClasses)) {
                        if (elementClasses.indexOf("yp-selected-boxed-") > -1) {
                            return false;
                        }
                    }

                    // If colorpicker stop.
                    if (mainBody.hasClass("yp-element-picker-active")) {

                        window.pickerColor = element.css("backgroundColor");

                        if (window.pickerColor == '' || window.pickerColor == 'transparent') {

                            var bgColor = $(this).css("backgroundColor");
                            element.parents().each(function() {

                                if (bgColor != 'transparent' && bgColor != '' && bgColor !== null) {
                                    window.pickerColor = $(this).css("backgroundColor");
                                    return false;
                                }

                            });

                        }

                        var color = window.pickerColor.toString();

                        $(".yp-element-picker.active").parent().parent().find(".wqcolorpicker").val(get_color(color)).trigger("change");

                        if (window.pickerColor == '' || window.pickerColor == 'transparent') {
                            var id_prt = $(".yp-element-picker.active").parent().parent();
                            id_prt.find(".yp-disable-btn.active").trigger("click");
                            id_prt.find(".yp-none-btn:not(.active)").trigger("click");
                            id_prt.find(".wqminicolors-swatch-color").css("backgroundImage", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAADsAQMAAABNHdhXAAAABlBMVEW/v7////+Zw/90AAAAUElEQVRYw+3RIQ4AIAwDwAbD/3+KRPKDGQQQbpUzbS6zF0lLeSffqYr3cXHzzd3PivHmzZs3b968efPmzZs3b968efPmzZs3b968efP+03sBF7TBCROHcrMAAAAASUVORK5CYII=)");
                        }

                    }

                    var nodeName = element[0].nodeName;

                    // If element already selected, stop.
                    if (is_content_selected() === true && mainBody.hasClass("yp-control-key-down") === false) {
                        return false;
                    }

                    // Not show if p tag and is empty.
                    if (element.html() == '&nbsp;' && element[0].nodeName == 'P') {
                        return false;
                    }

                    if (nodeName.toLowerCase() == 'html') {
                        return false;
                    }

                    // if Not Null continue.
                    if (element === null) {
                        return false;
                    }

                    // stop if not have
                    if (element.length === 0) {
                        return false;
                    }

                    // If selector disable stop.
                    if (body.hasClass("yp-selector-disabled")) {
                        return false;
                    }

                    // Cache
                    window.styleData = element.attr("style");

                    if(isUndefined(window.styleData)){
                        window.styleData = '';
                    }

                    if (is_content_selected() === false){

                        // Remove all ex data.
                        clean();

                        // Hover it
                        element.addClass("yp-selected");

                    }

                    // Geting selector.
                    var selector;
                    if (window.setSelector === false) {
                        selector = get_parents(element, "default");
                    } else {
                        selector = window.setSelector;
                    }
                    

                    evt.stopPropagation();
                    evt.preventDefault();

                    if (is_content_selected() === false) {

                            // transform.
                            if (check_with_parents(element, "transform", "none", "!=") === true) {
                                body.addClass("yp-has-transform");
                            }

                            draw_box(evt.target, 'yp-selected-boxed');

                            var selectorView = selector;

                            var selectorTag = selector.replace(/>/g, '').replace(/  /g, ' ').replace(/\:nth-child\((.*?)\)/g, '');

                            // Element Tooltip  |  Append setting icon.
                            iframeBody.append("<div class='yp-selected-tooltip'><small class='yp-tooltip-small'>" + get_tag_information(selectorTag) + "</small> " + $.trim(selectorView) + "</div><div class='yp-edit-tooltip'><span class='yp-edit-menu'></span><span class='yp-edit-style'></span><span class='yp-edit-edit'></span></div>");

                            // Select Others.. (using .not because will be problem when selector has "," multip selectors)
                            iframe.find(selector).not(".yp-selected").not(".yp-multiple-selected").each(function(i) {

                                $(this).addClass("yp-selected-others");
                                draw_other_box(this, 'yp-selected-others', i);

                            });

                            draw_tooltip();

                    }else{

                        if(is_content_selected() && mainBody.hasClass("yp-control-key-down")){

                            if(element.parents(".yp-selected").length === 0){

                                // Clean before
                                iframe.find(".yp-multiple-selected").removeClass("yp-multiple-selected");

                                // Add new
                                element.addClass("yp-multiple-selected");

                                // Draw
                                draw_other_box(element, 'yp-selected-others', "multiable");

                            }

                        }

                    }

                }

            });


            /* ---------------------------------------------------- */
            /* Doing update the draw.                               */
            /* ---------------------------------------------------- */
            function draw() {

                // If not visible stop.
                var element = get_selected_element();
                if (check_with_parents(element, "display", "none", "==") === true || check_with_parents(element, "opacity", "0", "==") === true || check_with_parents(element, "visibility", "hidden", "==") === true) {
                    return false;
                }

                // selected boxed.
                draw_box(".yp-selected", 'yp-selected-boxed');

                // Select Others.
                iframe.find(".yp-selected-others:not(.yp-multiple-selected)").each(function(i) {
                    draw_other_box(this, 'yp-selected-others', i);
                });

                // Tooltip
                draw_tooltip();

                // Dragger update.
                update_drag_handle_position();

            }


            // Resort media query by media numbers.
            function resort_style_data_positions(){

                var styleArea = the_editor_data();

                // Sort element by selector because Created CSS Will keep all css rules in one selector.
                styleArea.find("style").each(function(){

                    var that = $(this);

                    // Check if not resorted.
                    if(that.hasClass("yp-resorted") === false){

                        // addClass for not sort again.
                        that.addClass("yp-resorted");

                        // Get this selector.
                        var style = that.attr("data-style");

                        // check if there next styles that has same selector.
                        if(styleArea.find("[data-style="+style+"]").length > 1){

                            // Find all next styles that has same selector
                            styleArea.find("[data-style="+style+"]").not(this).each(function(){

                                // Cache
                                var element = $(this);

                                if(element.hasClass("yp-resorted") === false){

                                    // move from dom.
                                    that.after(element);

                                    // add class
                                    element.addClass("yp-resorted");

                                }

                            });

                        }

                    }

                });

                // max-width == 9 > 1
                styleArea.find("style[data-size-mode^='(max-width:']").not("[data-size-mode*=and]").sort(function (a,b){
                    return +parseInt(b.getAttribute('data-size-mode').replace(/\D/g,'')) - +parseInt(a.getAttribute('data-size-mode').replace(/\D/g,''));
                }).appendTo(styleArea);

                // min-width == 1 > 9
                styleArea.find("style[data-size-mode^='(min-width:']").not("[data-size-mode*=and]").sort(function (a,b){
                    return +parseInt(a.getAttribute('data-size-mode').replace(/\D/g,'')) - +parseInt(b.getAttribute('data-size-mode').replace(/\D/g,''));
                }).appendTo(styleArea);

            }


            function create_media_query_before(css) {

                if (mainBody.hasClass("process-by-code-editor")) {
                    if (mainBody.attr("data-responsive-type") !== undefined && mainBody.attr("data-responsive-type") !== false && mainBody.attr("data-responsive-type") != 'desktop') {
                        return mainBody.attr("data-responsive-type");
                    } else {
                        return '';
                    }
                }

                if (mainBody.hasClass("yp-responsive-device-mode")) {

                    var w = $("#iframe").width();
                    var format = $(".media-control").attr("data-code");
                    return '@media (' + format + ':' + w + 'px){';

                } else {

                    if(isUndefined(css)){
                        return '';
                    }

                    var automedia = get_media_queries(css);

                    if(automedia != false){
                        mainBody.addClass("yp-adding-auto-media");
                        return automedia+"{";
                    }else{
                        return '';
                    }

                    
                }

            }

            function create_media_query_after() {

                if (mainBody.hasClass("yp-responsive-device-mode")) {

                    return '}';

                } else {

                    // Auto Media
                    if(mainBody.hasClass("yp-adding-auto-media")){
                        mainBody.removeClass("yp-adding-auto-media");
                        return '}';
                    }else{
                        return ''; // Blank
                    }

                }

            }

            $(".media-control").click(function() {
                var c = $(this).attr("data-code");

                if (c == 'max-width') {
                    $(this).attr("data-code", "min-width");
                    $(this).text("above");
                }

                if (c == 'min-width') {
                    $(this).attr("data-code", "max-width");
                    $(this).text("below");
                }

                update_responsive_size_notice();

            });

            /* ---------------------------------------------------- */
            /* use important if CSS not working without important   */
            /* ---------------------------------------------------- */
            function force_insert_rule(selector, id, value, prefix, size) {

                if (isUndefined(size)) {
                    if (mainBody.hasClass("yp-responsive-device-mode")) {
                        var frameW = $("#iframe").width();
                        var format = $(".media-control").attr("data-code");
                        size = '(' + format + ':' + frameW + 'px)';
                    } else {
                        size = 'desktop';
                    }
                }

                var css = id;

                // Clean value
                value = value.replace(/\s+?!important/g,'').replace(/\;$/g,'');

                // Remove Style Without important.
                iframe.find("." + get_id(selector) + '-' + id + '-style[data-size-mode="' + size + '"]').remove();

                // Append Style Area If Not Have.
                if (the_editor_data().length <= 0) {
                    iframeBody.append("<div class='yp-styles-area'></div>");
                }

                // Checking.
                if (value == 'disable' || value == '' || value == 'undefined' || value === null) {
                    
                    return false;
                }

                // Responsive Settings
                var mediaBefore = create_media_query_before(css);

                if(mainBody.hasClass("yp-adding-auto-media")){
                    size = space_cleaner(mediaBefore.replace("@media","").replace("{",""));
                }

                var mediaAfter = create_media_query_after();

                if(isDefined(size) && body.hasClass("yp-animate-manager-active") && body.hasClass("yp-responsive-device-mode")){
                    mediaBefore = "@media " + size + "{";
                }


                // Append.
                if (get_id(selector) != '') {

                    if (is_animate_creator() === true && id != 'position') {

                        iframe.find("." + get_id(body.attr("data-anim-scene") + css)).remove();

                        iframe.find(".yp-anim-scenes ." + body.attr('data-anim-scene') + "").append('<style data-rule="' + css + '" class="style-' + body.attr("data-anim-scene") + ' scenes-' + get_id(css) + '-style">' + selector + '{' + css + ':' + value + prefix + ' !important}</style>');

                    } else {

                        the_editor_data().append('<style data-rule="' + css + '" data-size-mode="' + size + '" data-style="' + get_id(selector) + '" class="' + get_id(selector) + '-' + id + '-style yp_current_styles">' + mediaBefore + '' + '' + selector + '{' + css + ':' + value + prefix + ' !important}' + '' + mediaAfter + '</style>');

                        resort_style_data_positions();

                    }

                }

                

            }

            //setup before functions
            var typingTimer;

            // Keyup bind For CSS Editor.
            $("#cssData").on("keyup", function(e) {

                var typingTimerS = 0;
                if(e.originalEvent){
                    typingTimerS = 900;
                }

                if (body.hasClass("yp-selectors-hide") === false && body.hasClass("yp-css-data-trigger") === false && typingTimerS !== 0) {

                    body.addClass("yp-selectors-hide");

                    // Opacity Selector
                    if (iframe.find(".context-menu-active").length > 0) {
                        get_selected_element().contextMenu("hide");
                    }

                    hide_frame_ui(0);

                }

                body.removeClass("yp-css-data-trigger");

                clearTimeout(typingTimer);
                typingTimer = setTimeout(function() {

                    if (body.hasClass("yp-selectors-hide") && $(".wqNoUi-active").length === 0 && mainBody.hasClass("autocomplete-active") === false && $(".yp-select-bar .tooltip").length === 0) {

                        body.removeClass("yp-selectors-hide");

                        show_frame_ui(200);

                    }

                    insert_default_options();
                    return false;

                }, typingTimerS);

                // Append all css to iframe.
                if (iframe.find("#yp-css-data-full").length === 0) {
                    the_editor_data().after("<style id='yp-css-data-full'></style>");
                }

                // Need to process.
                body.addClass("yp-need-to-process");

                // Update css source.
                iframe.find("#yp-css-data-full").html(editor.getValue());

                // Empty data.
                the_editor_data().empty();

                // Remove ex.
                iframe.find(".yp-live-css").remove();

                // Update
                $(".yp-save-btn").html(l18_save).removeClass("yp-disabled").addClass("waiting-for-save");

                // Update sceen.
                gui_update();

            });

            // Return to data again.
            $(".yp-select-bar").on("mouseover mouseout", function() {

                if (mainBody.hasClass("yp-need-to-process")) {

                    // CSS To Data.
                    process(false, false);

                }

            });

            window.yp_elements = ".yp-selected-handle,.yp-selected-tooltip,.yp-selected-boxed-margin-top,.yp-selected-boxed-margin-bottom,.yp-selected-boxed-margin-left,.yp-selected-boxed-margin-right,.yp-selected-boxed-top,.yp-selected-boxed-bottom,.yp-selected-boxed-left,.yp-selected-boxed-right,.yp-selected-others-box,.yp-edit-tooltip,.yp-selected-boxed-padding-top,.yp-selected-boxed-padding-bottom,.yp-selected-boxed-padding-left,.yp-selected-boxed-padding-right,.yp-edit-menu,.yp-edit-edit,.yp-edit-style";

            // Hide Slowly
            function hide_frame_ui(number) {

                if (!is_content_selected()) {
                    return false;
                }

                if (iframe.find(".yp-selected-boxed-top").css("opacity") != 1) {
                    return false;
                }

                draw();

                iframe.find(window.yp_elements).stop().animate({
                    opacity: 0
                }, number);

            }

            // Show Slowly.
            function show_frame_ui(number) {

                if (!is_content_selected()) {
                    return false;
                }

                if(body.hasClass("yp-force-hide-select-ui")){
                    return false;
                }

                if (iframe.find(".yp-selected-boxed-top").css("opacity") != "0") {
                    return false;
                }

                draw();

                iframe.find(window.yp_elements).stop().not(".yp-selected-others-box").animate({
                    opacity: 1
                }, number);

                iframe.find(".yp-selected-others-box").stop().animate({
                    opacity: 0.9
                }, number);

            }

            // Hide borders while editing.
            $(".yp-this-content,.anim-bar").bind({
                mouseenter: function() {

                    if($(".fake-layer").length > 0){
                        return false;
                    }

                    if (body.hasClass("yp-selectors-hide") === false) {

                        body.addClass("yp-selectors-hide");

                        // Opacity Selector
                        if (iframe.find(".context-menu-active").length > 0) {
                            get_selected_element().contextMenu("hide");
                        }

                        hide_frame_ui(200);

                    }

                },
                mouseleave: function() {

                    if($(".fake-layer").length > 0){
                        return false;
                    }

                    if (body.hasClass("yp-selectors-hide") && $(".wqNoUi-active").length === 0 && mainBody.hasClass("autocomplete-active") === false && $(".yp-select-bar .tooltip").length === 0) {

                        body.removeClass("yp-selectors-hide");

                        show_frame_ui(200);

                    }

                }
            });

            // If on iframe, always show borders.
            iframe.on("mouseover", iframe, function(){

                if ($(".wqNoUi-active").length === 0 && mainBody.hasClass("autocomplete-active") === false && $(".yp-select-bar .tooltip").length === 0) {

                    show_frame_ui(200);

                }

            });

            // YP bar leave: show.
            iframe.on("mouseleave", ".yp-select-bar", function(){

                if (body.hasClass("yp-selectors-hide") && $(".wqNoUi-active").length === 0 && mainBody.hasClass("autocomplete-active") === false && $(".yp-select-bar .tooltip").length === 0) {

                    body.removeClass("yp-selectors-hide");

                    show_frame_ui(200);

                }

            });


            // Get current media condition
            function get_media_condition(){

                // Default
                var size = 'desktop';
                
                // Is res?
                if (mainBody.hasClass("yp-responsive-device-mode")) {

                    var frameWidth = $("#iframe").width();
                    var media = $(".media-control").attr("data-code");
                    size = '(' + media + ':' + frameWidth + 'px)';

                }

                return size;

            }


            // Getting current CSS Selectors
            function get_all_selectors(source){

                source = get_minimized_css(source,true);

                // if no source, stop.
                if (source == '') {
                    return false;
                }

                // if have a problem in source, stop.
                if (source.split('{').length != source.split('}').length) {
                    return false;
                }

                source = source.toString().replace(/\}\,/g, "}");

                // Getting All CSS Selectors.
                var allSelectors = array_cleaner(source.replace(/\{(.*?)\}/g, '|BREAK|').split("|BREAK|"));

                return allSelectors;


            }

            // Reset selected element
            function reset_selected_element(childs){

                // If not have an selected element
                if(!is_content_selected()){
                    return false;
                }

                var data = editor.getValue();

                // Selectors
                var array = get_all_selectors(data);

                // If not have selectors
                if(array.length <= 0){
                    return false;
                }

                // Each all selectors
                for(var i = 0; i < array.length; i++){

                    var searchSelector = get_foundable_query(array[i],true,true,true);


                    if(childs === false){

                        // Target is selected element.
                        if(iframe.find(searchSelector).hasClass("yp-selected")){

                            // remove
                            iframe.find("[data-style='"+get_id(array[i])+"']").remove();

                        }

                    }

                    if(childs === true){

                        // Target is selected element and childs.
                        if(iframe.find(searchSelector).parents(".yp-selected").length > 0){

                            // remove
                            iframe.find("[data-style='"+get_id(array[i])+"']").remove();

                        }

                    }

                }

                // Update
                option_change();

                // Set && update        
                insert_default_options();

            }


            // Clean not:(X) etc. Not want "(" sysbol.
            function nice_selectors(data,start){

                if(start === true){

                    // Nth child
                    data = data.replace(/:nth-child\((.*?)\)/g, '\.nth-child\.$1\.');

                    // Not
                    data = data.replace(/:not\((.*?)\)/g, '\.notYP$1YP');

                    // lang
                    data = data.replace(/:lang\((.*?)\)/g, '\.langYP$1YP');

                    // nth-last-child()
                    data = data.replace(/:nth-last-child\((.*?)\)/g, '\.nth-last-child\.$1\.');

                    // nth-last-of-type()
                    data = data.replace(/:nth-last-of-type\((.*?)\)/g, '\.nth-last-of-type\.$1\.');

                    // nth-of-type()
                    data = data.replace(/:nth-of-type\((.*?)\)/g, '\.nth-of-type\.$1\.');

                }else{

                    // Nth child
                    data = data.replace(/\.nth-child\.(.*?)\./g, ':nth-child($1)');

                    // Not
                    data = data.replace(/\.notYP(.*?)YP/g, ':not($1)');

                    // lang
                    data = data.replace(/\.langYP(.*?)YP/g, ':lang($1)');

                    // nth-last-child()
                    data = data.replace(/\.nth-last-child\.(.*?)\./g, ':nth-last-child($1)');

                    // nth-last-of-type()
                    data = data.replace(/\.nth-last-of-type\.(.*?)\./g, ':nth-last-of-type($1)');

                    // nth-of-type()
                    data = data.replace(/\.nth-of-type\.(.*?)\./g, ':nth-of-type($1)');

                }

                return data;

            }


            // Super basic insert any css rule to plugin data.
            function get_insert_rule_basic(selector, id, value, size) {

                var appendData = '';

                if (isUndefined(size)) {
                    if (mainBody.hasClass("yp-responsive-device-mode")) {
                        var frameW = $("#iframe").width();
                        var format = $(".media-control").attr("data-code");
                        size = '(' + format + ':' + frameW + 'px)';
                    } else {
                        size = 'desktop';
                    }
                }

                // Responsive Settings
                var mediaBefore = create_media_query_before(id);

                if(mainBody.hasClass("yp-adding-auto-media")){
                    size = space_cleaner(mediaBefore.replace("@media","").replace("{",""));
                }

                var mediaAfter = create_media_query_after();

                if(isDefined(size) && body.hasClass("yp-animate-manager-active") && body.hasClass("yp-responsive-device-mode")){
                    mediaBefore = "@media " + size + "{";
                }

                // Delete same data.
                var exStyle = iframe.find("." + get_id(selector) + '-' + id + '-style[data-size-mode="' + size + '"]');
                if (exStyle.length > 0) {
                    if (escape_data_value(exStyle.html()) == value) {
                        return false;
                    } else {
                        exStyle.remove(); // else remove.
                    }
                }

                // Delete same for -webkit- prefix: filter and transform.
                exStyle = iframe.find("." + get_id(selector) + '-' + "-webkit-" + id + '-style[data-size-mode="' + size + '"]');
                if (exStyle.length > 0) {
                    if (escape_data_value(exStyle.html()) == value){
                        return false;
                    } else {
                        exStyle.remove(); // else remove.
                    }
                }

                // Append style area.
                if (the_editor_data().length <= 0) {
                    iframeBody.append("<div class='yp-styles-area'></div>");
                }

                // Append default value.
                if (get_id(selector) != ''){

                    var dpt = ':';

                    // Append
                    appendData = '<style data-rule="' + id + '" data-size-mode="' + size + '" data-style="' + get_id(selector) + '" class="' + get_id(selector) + '-' + id + '-style yp_current_styles">' + mediaBefore + '' + '' + selector + '{' + id + dpt + value + '}' + '' + mediaAfter + '</style>';

                }

                return appendData;

            }


            // CSS To Yellow Pencil Data.
            function css_to_data(type) {

                // add classses and use as flag.
                body.addClass("process-by-code-editor").attr("data-responsive-type", type);

                // Source.
                var source = editor.getValue();

                // Clean "()" symbol for lets to process CSS as well.
                source = nice_selectors(source,true);

                // Clean.
                source = source.replace(/(\r\n|\n|\r)/g, "").replace(/\t/g, '');

                // Don't care rules in comment.
                source = source.replace(/\/\*(.*?)\*\//g, "");

                // clean.
                source = source.replace(/\}\s+\}/g, '}}').replace(/\s+\{/g, '{').replace(/\}\s+/g,'}');

                // clean.
                source = source.replace(/\s+\}/g, '}').replace(/\{\s+/g, '{');
                source = filter_bad_queries(source);

                // If responsive
                if (type != 'desktop') {

                    // Media query regex. Clean everything about media.
                    var regexType = $.trim(type.replace(/\)/g, "\\)").replace(/\(/g, "\\("));
                    var re = new RegExp(regexType + "(.*?)\}\}", "g");
                    var reQ = new RegExp(regexType, "g");
                    source = source.match(re).toString();

                    source = source.replace(reQ, "");
                    source = source.toString().replace(/\}\}/g, "}");

                } else {

                    // Don't care rules in media query in non-media mode.
                    source = source.replace(/@media(.*?)\}\}/g, '');

                }

                // if no source, stop.
                if (source == '') {
                    return false;
                }

                // if have a problem in source, stop.
                if (source.split('{').length != source.split('}').length) {
                    swal({title: "Sorry.",text: "CSS Editor: Parse Error.",type: "error",animation: false});
                    return false;
                }

                var selector,insertData = '';

                // IF Desktop; Remove All Rules. (because first call by desktop)
                if (type == 'desktop') {
                    the_editor_data().empty();
                }

                // Replace ","" after "}".
                source = source.toString().replace(/\}\,/g, "}");

                // Getting All CSS Selectors.
                var allSelectors = array_cleaner(source.replace(/\{(.*?)\}/g, '|BREAK|').split("|BREAK|"));

                // add to first.
                source = "}" + source;

                // Make } it two for get multiple selectors rules.
                source = source.replace(/\}/g,"}}");

                // Each All Selectors
                for (var i = 0; i < allSelectors.length; i++) {

                    // Get Selector.
                    selector = space_cleaner(allSelectors[i]);

                    // Valid selector
                    if (selector.indexOf("}") == -1 && selector.indexOf("{") == -1) {

                        // Clean selector with regex.
                        var selectorRegex = selector_regex(selector);
                        
                        // Getting CSS Rules by selector.
                        var CSSRules = source.match(new RegExp("\}" + selectorRegex + '{(.*?)}', 'g'));

                        // Back up cleanen "(" symbols
                        selector = nice_selectors(selector,false);

                        if (CSSRules !== null && CSSRules != '') {

                            // Clean.
                            CSSRules = CSSRules.toString().match(/\{(.*?)\}/g).toString().replace(/\}\,\{/g, ';').replace(/\{/g, '').replace(/\}/g, '').replace(/\;\;/g, ';').split(";");

                            // Variables.
                            var ruleAll;
                            var ruleName;
                            var ruleVal;

                            // Each CSSRules.
                            for (var iq = 0; iq < CSSRules.length; iq++) {

                                ruleAll = $.trim(CSSRules[iq]);

                                if (typeof ruleAll !== undefined && ruleAll.length >= 3 && ruleAll.indexOf(":") != -1) {

                                    ruleName = ruleAll.split(":")[0];

                                    if (ruleName != '') {

                                        ruleVal = ruleAll.split(':').slice(1).join(':');

                                        if (ruleVal != '') {

                                            // Update
                                            insertData += get_insert_rule_basic(selector, ruleName, ruleVal, type.toString().replace(/\{/g, '').replace(/@media /g, '').replace(/@media/g, ''));

                                        }

                                    }

                                }

                            }

                        }

                    }

                }

                // insert at end.
                if(insertData != ''){
                    the_editor_data().append(insertData);
                    resort_style_data_positions();
                }

                // remove classes when end.
                body.removeAttr("data-responsive-type");

            }

            /* ---------------------------------------------------- */
            /* Appy CSS To theme for demo                           */
            /* ---------------------------------------------------- */
            function insert_rule(selector, id, value, prefix, size) {

                if(selector === null){
                    selector = get_current_selector();
                }

                if (isUndefined(size)){
                    size = get_media_condition();
                }

                prefix = $.trim(prefix);

                if (prefix == '.s') {
                    prefix = 's';
                }

                if (prefix.indexOf("px") != -1) {
                    prefix = 'px';
                }

                var css = id;

                // Delete basic CSS.
                delete_live_css(id, false);

                // delete live css.
                iframe.find(".yp-live-css").remove();

                // stop if empty
                if (value == '' || value == ' ') {
                    
                    return false;
                }

                // toLowerCase
                id = id.toString().toLowerCase();
                css = css.toString().toLowerCase();
                prefix = prefix.toString().toLowerCase();

                if(value.length){

                    var r1 = /\.00$/;
                    var r2 = /\.0$/;

                    if(r1.test(value)){
                        value = value.replace(/\.00$/g,"");
                    }

                    if(r2.test(value)){
                        value = value.replace(/\.0$/g,"");
                    }

                }

                // Value always loweCase.
                if (id != 'font-family' && id != 'background-image' && id != 'animation-name' && id != 'animation-play' && id != 'filter' && id != '-webkit-filter' && id != '-webkit-transform') {
                    value = value.toString().toLowerCase();
                }


                // Checks min height and min width and update.
                if(id == 'height' || id == 'width'){

                    // minValue & minFormat
                    var minVal = number_filter($("#min-"+id+"-value").val());
                    var minFormat = $("#min-"+id+"-after").val();

                    // if height is smaller than min-height, so update min height
                    if(parseFloat(value) < parseFloat(minVal) && prefix == minFormat){

                        // Insert min-height
                        insert_rule(selector,'min-'+id,value,prefix,size);

                        // Set default values
                        setTimeout(function(){
                            $.each(['min-'+id], function(i, v) {
                                set_default_value(v);
                            });
                        },50);

                    }

                }


                // Anim selector.
                if (is_animate_creator() === true && id != 'position') {

                    selector = $.trim(selector.replace(/(body)?\.yp-scene-[0-9]/g, ''));
                    selector = add_class_to_body(selector, "yp-" + body.attr("data-anim-scene"));

                    // Dont add any animation rule.
                    if (id.indexOf('animation') != -1) {
                        return false;
                    }

                }

                // Stop.
                if (css == 'set-animation-name') {
                    
                    return false;
                }

                if (id == 'background-color' || id == 'color' || id == 'border-color' || id == 'border-left-color' || id == 'border-right-color' || id == 'border-top-color' || id == 'border-bottom-color') {

                    var valueCheck = $.trim(value).replace("#", '');

                    if (valueCheck == 'red') {
                        value = '#FF0000';
                    } else if (valueCheck == 'white') {
                        value = '#FFFFFF';
                    } else if (valueCheck == 'blue') {
                        value = '#0000FF';
                    } else if (valueCheck == 'orange') {
                        value = '#FFA500';
                    } else if (valueCheck == 'green') {
                        value = '#008000';
                    } else if (valueCheck == 'purple') {
                        value = '#800080';
                    } else if (valueCheck == 'pink') {
                        value = '#FFC0CB';
                    } else if (valueCheck == 'black') {
                        value = '#000000';
                    } else if (valueCheck == 'brown') {
                        value = '#A52A2A';
                    } else if (valueCheck == 'yellow') {
                        value = '#FFFF00';
                    } else if (valueCheck == 'gray') {
                        value = '#808080';
                    }

                }

                // Set perspective id to parent
                if(id == 'perspective'){

                    // Cache current
                    var oldSelector = selector;

                    // clean cache
                    body.removeAttr("data-clickable-select");

                    // Update selector var
                    selector = $.trim(get_parents(get_selected_element().parent(), "defaultS"));

                    // set old as cache again
                    body.attr("data-clickable-select",oldSelector);

                }

                // Set defaults
                if(id == 'border-width'){

                    // Set default values
                    $.each(['border-top-width','border-left-width','border-right-width','border-bottom-width'], function(i, v) {
                        set_default_value(v);
                    });

                }

                if(id == 'border-color'){

                    // Set default values
                    $.each(['border-top-color','border-left-color','border-right-color','border-bottom-color'], function(i, v) {
                        set_default_value(v);
                    });

                }

                if(id == 'border-style'){

                    // Set default values
                    $.each(['border-top-style','border-left-style','border-right-style','border-bottom-style'], function(i, v) {
                        set_default_value(v);
                    });

                }

                // When border-xxxx-style change
                if(id.indexOf("border-") != -1 && id.indexOf("-style") != -1 && id != 'border-style'){

                    // update default value for;
                    set_default_value("border-style");

                }

                // When border-xxxx-style change
                if(id.indexOf("border-") != -1 && id.indexOf("-color") != -1 && id != 'border-color'){

                    // update default value for;
                    set_default_value("border-color");

                }

                // When border-xxxx-style change
                if(id.indexOf("border-") != -1 && id.indexOf("-width") != -1 && id != 'border-width'){

                    // update default value for;
                    set_default_value("border-width");

                }


                // also using in bottom.
                var duration,delay;

                // Animation name play.
                if (id == 'animation-name' || id == 'animation-play' || id == 'animation-iteration' || id == 'animation-duration') {

                    if($(".yp-animate-manager-active").length === 0 && value != 'none'){

                        duration = get_selected_element().css("animationDuration");
                        delay = get_selected_element().css("animationDelay");

                        // Getting right time delay if have multiple animations.
                        var newDelay = get_multiple_delay(duration,delay);

                        if(newDelay !== false){
                            delay = parseFloat(newDelay);
                        }else if(isUndefined(delay)){
                            delay = 0;
                        }else{
                            delay = parseFloat(duration_ms(delay)); // delay
                        }

                        if (isUndefined(duration)) {
                            duration = 1000;
                        } else {
                            duration = parseFloat(duration_ms(duration)); // duration
                        }

                        var waitDelay = delay + duration;

                        if(waitDelay === 0){
                            waitDelay = 1000;
                        }

                        waitDelay = waitDelay + 100;

                        // Add class.
                        body.addClass("yp-hide-borders-now yp-force-hide-select-ui");
                        
                        clear_animation_timer();

                        window.animationTimer1 = setTimeout(function(){

                            // remove class.
                            body.removeClass("yp-hide-borders-now yp-force-hide-select-ui");

                            element_animation_end();

                            // Update.
                            draw();

                        }, waitDelay);

                    }

                }

                // If has style attr. // USE IMPORTANT
                if (css != 'top' && css != 'bottom' && css != 'left' && css != 'right' && css != 'height' && css != 'width') {

                    var element = get_selected_element();

                    if (isDefined(element.attr("style"))) {

                        // if more then one rule
                        if ($.trim(element.attr("style")).split(";").length > 0) {

                            var obj = element.attr("style").split(";");

                            for (var item in obj) {
                                if ($.trim(obj[item].split(":")[0]) == css) {

                                    // Use important.
                                    if (css != 'position' && css != 'animation-fill-mode') {
                                        force_insert_rule(selector, id, value, prefix, size);
                                        
                                        return false;
                                    }

                                }
                            }

                        } else {
                            if ($.trim(element.attr("style")).split(":")[0] == css) {

                               if (css != 'position' && css != 'animation-fill-mode') {
                                    force_insert_rule(selector, id, value, prefix, size);
                                    
                                    return false;
                                }

                            }
                        }

                    }
                }

                // Background image fix.
                if (id == 'background-image' && value != 'disable' && value != 'none' && value != '') {
                    if (value.replace(/\s/g, "") == 'url()' || value.indexOf("//") == -1) {
                        value = 'disable';
                    }
                }

                // adding automatic relative.
                if (id == 'top' || id == 'bottom' || id == 'left' || id == 'right') {

                    setTimeout(function() {
                        if ($("#position-static").parent().hasClass("active") || $("#position-relative").parent().hasClass("active")){
                            $("#position-relative").trigger("click");
                        }
                    }, 5);

                }

                // Background color
                if (id == 'background-color') {
                    if ($("#yp-background-image").val() != 'none' && $("#yp-background-image").val() != '') {
                        force_insert_rule(selector, id, value, prefix, size);
                        
                        return false;
                    }
                }

                if (id == 'animation-name' && $(".yp-animate-manager-active").length === 0){
                    set_default_value('animation-duration');
                    set_default_value('animation-delay');
                    set_default_value('animation-fill-mode');
                }

                // Animation Name Settings. (Don't playing while insert by CSS editor or animation manager)
                if (body.hasClass("process-by-code-editor") === false && $(".yp-animate-manager-active").length === 0) {

                    if (id == 'animation-name' || id == 'animation-duration' || id == 'animation-delay') {

                        if(mainBody.hasClass("yp-animate-manager-mode") === false){
                            selector = selector.replace(/\.yp_onscreen/g, '').replace(/\.yp_hover/g, '').replace(/\.yp_focus/g, '').replace(/\.yp_click/g, '');
                        }

                        var play = '';
                        if(mainBody.hasClass("yp-animate-manager-mode") === false){
                            play = "." + $("#yp-animation-play").val();
                        }

                        // Getting array
                        var selectorNew = selector.split(":");

                        // Check if there have : 
                        if(selectorNew.length > 0){

                            // Getting all prev selectors until last :
                            var prevSelectors = '';

                            for(var y = 0; y < selectorNew.length-1; y++){
                                prevSelectors = prevSelectors + selectorNew[y];
                            }

                            if (selectorNew[selectorNew.length-1] == 'hover' || selectorNew[selectorNew.length-1] == 'focus') {
                                selector = prevSelectors + play + ":" + selectorNew[selectorNew.length-1];
                            }else{

                                selector = selector + play;

                            }

                        }else{ // default

                            selector = selector + play;

                        }

                    }

                }

                // Selection settings.
                var selection = $('body').attr('data-yp-selector');

                if (isUndefined(selection)) {

                    selection = '';

                } else {

                    if(!mainBody.hasClass("yp-processing-now") && selector.indexOf("yp_onscreen") == -1 && selector.indexOf("yp_click") == -1 && selector.indexOf("yp_focus") == -1 && selector.indexOf("yp_hover") == -1 && id != 'animation-play'){

                        selector = add_class_to_body(selector, 'yp-selector-' + selection.replace(':', ''));

                        selector = selector.replace('body.yp-selector-' + selection.replace(':', '') + ' body.yp-selector-' + selection.replace(':', '') + ' ', 'body.yp-selector-' + selection.replace(':', '') + ' ');

                    }

                }



                // Responsive Settings
                var mediaBefore = create_media_query_before(css);

                if(mainBody.hasClass("yp-adding-auto-media")){
                    size = space_cleaner(mediaBefore.replace("@media","").replace("{",""));
                }

                var mediaAfter = create_media_query_after();

                if(isDefined(size) && body.hasClass("yp-animate-manager-active") && body.hasClass("yp-responsive-device-mode")){
                    mediaBefore = "@media " + size + "{";
                }


                // Delete same data.
                var exStyle = iframe.find("." + get_id(selector) + '-' + id + '-style[data-size-mode="' + size + '"]');
                if (exStyle.length > 0){
                    if (escape_data_value(exStyle.html()) == value) {
                        return false;
                    } else {
                        exStyle.remove(); // else remove.
                    }
                }

                // Delete same data for anim.
                if (is_animate_creator()) {
                    exStyle = iframe.find(".yp-anim-scenes ." + $('body').attr('data-anim-scene') + " .scenes-" + get_id(id) + "-style");
                    if (exStyle.length > 0) {
                        if (escape_data_value(exStyle.html()) == value) {
                            return false;
                        } else {
                            exStyle.remove(); // else remove.
                        }
                    }
                }

                // Delete same data for filter and transform -webkit- prefix.
                exStyle = iframe.find("." + get_id(selector) + '-' + "-webkit-" + id + '-style[data-size-mode="' + size + '"]');
                if (exStyle.length > 0) {
                    if (escape_data_value(exStyle.html()) == value) {
                        return false;
                    } else {
                        exStyle.remove(); // else remove.
                    }
                }

                // Delete same data for filter and transform -webkit- prefix on anim scenes.
                if (is_animate_creator()) {
                    exStyle = iframe.find(".yp-anim-scenes ." + $('body').attr('data-anim-scene') + " .scenes-webkit" + get_id(id) + "-style");
                    if (exStyle.length > 0) {
                        if (escape_data_value(exStyle.html()) == value) {
                            return false;
                        } else {
                            exStyle.remove(); // else remove.
                        }
                    }
                }

                // Filter
                if (id == 'filter' || id == 'transform') {

                    if (value != 'disable' && value != '' && value != 'undefined' && value !== null) {
                        insert_rule(selector, "-webkit-" + id, value, prefix, size);
                    }

                }

                // Append style area.
                if (the_editor_data().length <= 0) {
                    iframeBody.append("<div class='yp-styles-area'></div>");
                }

                // No px em etc for this options.
                if (id == 'z-index' || id == 'opacity' || id == 'background-parallax-speed' || id == 'background-parallax-x' || id == 'blur-filter' || id == 'grayscale-filter' || id == 'brightness-filter' || id == 'contrast-filter' || id == 'hue-rotate-filter' || id == 'saturate-filter' || id == 'sepia-filter' || id.indexOf("-transform") != -1) {
                    if (id != 'text-transform' && id != '-webkit-transform') {
                        value = number_filter(value);
                        prefix = '';
                    }
                }

                // Filter Default options.
                if (id == 'blur-filter' || id == 'grayscale-filter' || id == 'brightness-filter' || id == 'contrast-filter' || id == 'hue-rotate-filter' || id == 'saturate-filter' || id == 'sepia-filter') {

                    var filterData = filter_generator(true);

                    insert_rule(selector, 'filter', filterData, '', size);
                    
                    return false;

                }
                // Filter options end

                // Transform Settings
                if (id.indexOf("-transform") != -1 && id != 'text-transform' && id != '-webkit-transform') {

                    body.addClass("yp-has-transform");

                    var translateData = transform_generator(true);

                    insert_rule(selector, 'transform', translateData, '', size);

                    if(translateData == 'none' || translateData == 'disable'){
                        body.removeClass("yp-has-transform");
                    }
                    
                    return false;

                }
                // Transform options end

                // Box Shadow
                if (id == 'box-shadow-inset' || id == 'box-shadow-color' || id == 'box-shadow-vertical' || id == 'box-shadow-blur-radius' || id == 'box-shadow-spread' || id == 'box-shadow-horizontal') {

                    var shadowData = box_shadow_generator();

                    insert_rule(selector, 'box-shadow', shadowData, '', size);
                    
                    return false;

                }
                // Box shadow options end



                // Animation options
                if (id == 'animation-play') {

                    iframe.find("[data-style][data-size-mode='"+size+"']").each(function(){

                        // onscreen
                        if ($(this).data("style") == get_id(selector + ".yp_onscreen")) {
                            $(this).remove();
                        }

                        // hover
                        if ($(this).data("style") == get_id(selector + ".yp_hover")) {
                            $(this).remove();
                        }

                        // click
                        if ($(this).data("style") == get_id(selector + ".yp_click")) {
                            $(this).remove();
                        }

                        // click
                        if ($(this).data("style") == get_id(selector + ".yp_focus")) {
                            $(this).remove();
                        }

                    });

                    insert_rule(selector, 'animation-name', $("#yp-animation-name").val(), prefix, size);
                    
                    return false;

                }

                // Animation name
                if (id == 'animation-name' && body.hasClass("yp-animate-manager-active") === false){

                    if (value != 'disable' && value != 'none'){

                        // be sure has a selected element.
                        if(is_content_selected() && $("#animation-duration-group").hasClass("hidden-option") === false && $("#animation-delay-group").hasClass("hidden-option") === false){

                            // Get duration from CSS
                            duration = get_selected_element().css("animationDuration").replace(/[^0-9.,]/g, '');

                            // Get delay from CSS
                            delay = get_selected_element().css("animationDelay").replace(/[^0-9.,]/g, '');

                            // Get fill mode from CSS
                            var fillMode = get_selected_element().css("animationFillMode");

                            // If selected element;
                            if (get_foundable_query(selector,false,true,true) == get_current_selector().trim()){

                                // Duration
                                if(duration == "0"){
                                    duration = 1;
                                }

                                insert_rule(selector, 'animation-duration', duration + 's', prefix, size);


                                // Delay
                                if (delay < 0) {
                                    delay = 0;
                                }

                                insert_rule(selector, 'animation-delay', delay + 's', prefix, size);


                                // Delay
                                if (fillMode == null || fillMode == 'none') {
                                    fillMode = 'both';
                                }

                                insert_rule(get_current_selector(), 'animation-fill-mode', fillMode, prefix, size);

                            }

                        }

                    }

                    if (value == 'bounce') {

                        if (value != 'disable' && value != 'none') {
                            insert_rule(selector, 'transform-origin', 'center bottom', prefix, size);
                        } else {
                            insert_rule(selector, 'transform-origin', value, prefix, size);
                        }

                    } else if (value == 'swing') {

                        if (value != 'disable' && value != 'none') {
                            insert_rule(selector, 'transform-origin', 'top center', prefix, size);
                        } else {
                            insert_rule(selector, 'transform-origin', value, prefix, size);
                        }

                    } else if (value == 'jello') {

                        if (value != 'disable' && value != 'none') {
                            insert_rule(selector, 'transform-origin', 'center', prefix, size);
                        } else {
                            insert_rule(selector, 'transform-origin', value, prefix, size);
                        }

                    } else {
                        insert_rule(selector, 'transform-origin', 'disable', prefix, size);
                    }

                    if (value == 'flipInX') {
                        insert_rule(selector, 'backface-visibility', 'visible', prefix, size);
                    } else {
                        insert_rule(selector, 'backface-visibility', 'disable', prefix, size);
                    }

                }


                // Checking.
                if (value == 'disable' || value == '' || value == 'undefined' || value === null) {
                    
                    return false;
                }

                // New Value
                var current = value + prefix;

                // Clean.
                current = current.replace(/\s+?!important/g,'').replace(/\;$/g,'');

                // Append default value.
                if (get_id(selector) != '') {

                    var dpt = ':';

                    if (is_animate_creator() === true && id != 'position') {

                        iframe.find("." + get_id(body.attr("data-anim-scene") + css)).remove();

                        iframe.find(".yp-anim-scenes ." + body.attr("data-anim-scene") + "").append('<style data-rule="' + css + '" class="style-' + body.attr("data-anim-scene") + ' scenes-' + get_id(css) + '-style">' + selector + '{' + css + dpt + current + '}</style>');

                    } else {

                        the_editor_data().append('<style data-rule="' + css + '" data-size-mode="' + size + '" data-style="' + get_id(selector) + '" class="' + get_id(selector) + '-' + id + '-style yp_current_styles">' + mediaBefore + '' + '' + selector + '{' + css + dpt + current + '}' + '' + mediaAfter + '</style>');

                        resort_style_data_positions();

                    }

                    draw();

                }

                // No need to important for text-shadow.
                if (id == 'text-shadow' || id == 'perspective') {
                    return false;
                }

                var needToImportant = null;

                // Each all selected element and check if need to use important.
                iframe.find(".yp-selected,.yp-selected-others").each(function(){

                    // Default true.
                    needToImportant = true;

                    // Convert for check important need.
                    if(css == 'border-width'){
                        css = 'border-top-width';
                    }else if(css == 'border-style'){
                        css = 'border-top-style';
                    }else if(css == 'border-color'){
                        css = 'border-top-color';
                    }

                    // Current Value
                    var isValue = $(this).css(css);

                    // If current value not undefined
                    if (isDefined(isValue)) {

                        // for color
                        if (isValue.indexOf("rgb") != -1 && id != 'box-shadow') {

                            // Convert to hex.
                            isValue = get_color(isValue);

                        } else if (isValue.indexOf("rgb") != -1 && id == 'box-shadow') {

                            // for box shadow.
                            var justRgb = isValue.match(/rgb(.*?)\((.*?)\)/g).toString();
                            var valueNoColor = isValue.replace(/rgb(.*?)\((.*?)\)/g, "");
                            isValue = valueNoColor + " " + get_color(justRgb);

                        }

                        if(css == 'background-image'){
                            isValue = isValue.replace(/\'/g,'').replace(/\"/g,'');
                        }

                        if(css == 'box-shadow'){
                            isValue = isValue.replace('inset','');
                            isValue = isValue.replace(/\s+/g, ' ');
                        }

                        // Clean
                        isValue = $.trim(isValue);

                    }

                    if(css == 'box-shadow'){
                        current = current.replace('inset','');
                        current = current.replace(/\s+/g, ' ');
                    }

                    // Clean
                    current = $.trim(current);

                    // If date mean same thing: stop.
                    if (get_basic_id(current) == 'length' && get_basic_id(isValue) == 'autoauto') {
                        needToImportant = false;
                    }

                    if (get_basic_id(current) == 'inherit' && get_basic_id(isValue) == 'normal') {
                        needToImportant = false;
                    }

                    // No need important for parallax and filter.
                    if (id == 'background-parallax' || id == 'background-parallax-x' || id == 'background-parallax-speed' || id == 'filter' || id == '-webkit-filter' || id == '-webkit-transform') {
                        needToImportant = false;
                    }

                    if (isUndefined(isValue)) {
                        needToImportant = false;
                    }

                    // if value is same, stop.
                    if (current == isValue && iframe.find(".yp-selected-others").length === 0) {
                        needToImportant = false;
                    }

                    // font-family bug.
                    if ((current.replace(/'/g, '"').replace(/, /g, ",")) == isValue) {
                        needToImportant = false;
                    }

                    // background position fix.
                    if (id == 'background-position') {

                        if (current == 'lefttop' && isValue == '0%0%') {
                            needToImportant = false;
                        }

                        if (current == 'leftcenter' && isValue == '0%50%') {
                            needToImportant = false;
                        }

                        if (current == 'leftbottom' && isValue == '0%100%') {
                            needToImportant = false;
                        }

                        if (current == 'righttop' && isValue == '100%0%') {
                            needToImportant = false;
                        }

                        if (current == 'rightcenter' && isValue == '100%50%') {
                            needToImportant = false;
                        }

                        if (current == 'rightbottom' && isValue == '100%100%') {
                            needToImportant = false;
                        }

                        if (current == 'centertop' && isValue == '50%0%') {
                            needToImportant = false;
                        }

                        if (current == 'centercenter' && isValue == '50%50%') {
                            needToImportant = false;
                        }

                        if (current == 'centercenter' && isValue == '50%50%') {
                            needToImportant = false;
                        }

                        if (current == 'centerbottom' && isValue == '50%100%') {
                            needToImportant = false;
                        }

                        if (current == 'centerbottom' && isValue == '50%100%') {
                            needToImportant = false;
                        }

                    }


                    if (id == 'width' || id == 'min-width' || id == 'max-width' || id == 'height' || id == 'min-height' || id == 'max-height' || id == 'font-size' || id == 'line-height' || id == 'letter-spacing' || id == 'word-spacing' || id == 'margin-top' || id == 'margin-left' || id == 'margin-right' || id == 'margin-bottom' || id == 'padding-top' || id == 'padding-left' || id == 'padding-right' || id == 'padding-bottom' || id == 'border-left-width' || id == 'border-right-width' || id == 'border-top-width' || id == 'border-bottom-width' || id == 'border-top-left-radius' || id == 'border-top-right-radius' || id == 'border-bottom-left-radius' || id == 'border-bottom-right-radius' || id == 'opacity' || id == 'border-width' || id == 'z-index' || id == 'top' || id == 'left' || id == 'right' || id == 'bottom') {

                        // If value is similar.
                        if (number_filter(current.replace(/\.00$/g, "").replace(/\.0$/g, "")) !== '' && number_filter(current.replace(/\.00$/g, "").replace(/\.0$/g, "")) == number_filter(isValue.replace(/\.00$/g, "").replace(/\.0$/g, ""))){
                            needToImportant = false;
                        }

                        if(id == 'min-height' && mainBody.hasClass("yp-element-resizing")){
                            needToImportant = false;
                        }

                        if((Math.round(parseFloat(current) * 100) / 100) == (Math.round(parseFloat(isValue) * 100) / 100)){
                            needToImportant = false;
                        }

                        // Browser always return in px format, custom check for %, em.
                        if (current.indexOf("%") != -1 && isValue.indexOf("px") != -1) {

                            get_selected_element().addClass("yp-full-width");
                            var fullWidth = iframe.find(".yp-full-width").css("width");
                            get_selected_element().removeClass("yp-full-width");

                            if ((parseInt(isValue) - (parseInt(fullWidth) * parseFloat(current) / 100)) < 1) {
                                needToImportant = false;
                            }

                        }

                        // smart important not available for em format
                        if (current.indexOf("em") != -1 && isValue.indexOf("px") != -1) {
                            needToImportant = false;
                        }

                    }

                    // not use important, if browser return value with matrix.
                    if (id == "transform") {
                        if (isValue.indexOf("matrix") != -1) {
                            needToImportant = false;
                        }
                    }

                    if(id == 'animation-fill-mode' || id == 'transform-origin'){
                        needToImportant = false;
                    }

                    // not use important, If value is inherit.
                    if (current == "inherit" || current == "auto") {
                        needToImportant = false;
                    }

                    if(needToImportant === true){
                        return false;
                    }

                }); // Each end.

                if(mainBody.hasClass("yp-animate-manager-mode")){
                    needToImportant = false;
                }

                if(needToImportant === false){
                    
                    return false;
                }

                // Use important.
                force_insert_rule(selector, id, value, prefix, size);
                

            }

            // Hide blue borders on click options section.
            $(document).on("click",".yp-this-content",function(e){
                if (e.originalEvent) {
                    hide_frame_ui(200);
                }
            });


            /* ---------------------------------------------------- */
            /* Setup Slider Option                                  */
            /* ---------------------------------------------------- */
            function slider_option(id, decimals, pxv, pcv, emv) {

                var thisContent = $("#" + id + "-group").parent(".yp-this-content");

                // Set Maximum and minimum values for custom prefixs.
                $("#" + id + "-group").data("px-range", pxv);
                $("#" + id + "-group").data("pc-range", pcv);
                $("#" + id + "-group").data("em-range", emv);

                // Default PX
                var range = $("#" + id + "-group").data("px-range").split(",");

                // Update PX.
                if ($("#" + id + "-group .yp-after-prefix").val() == 'px') {
                    range = $("#" + id + "-group").data("px-range").split(",");
                }

                // Update %.
                if ($("#" + id + "-group .yp-after-prefix").val() == '%') {
                    range = $("#" + id + "-group").data("pc-range").split(",");
                }

                // Update EM.
                if ($("#" + id + "-group .yp-after-prefix").val() == 'em') {
                    range = $("#" + id + "-group").data("em-range").split(",");
                }

                // Update s.
                if ($("#" + id + "-group .yp-after-prefix").val() == 's') {
                    range = $("#" + id + "-group").data("em-range").split(",");
                }

                // Setup slider.
                $('#yp-' + id).wqNoUiSlider({

                    start: [0],

                    range: {
                        'min': parseInt(range[0]),
                        'max': parseInt(range[1])
                    },

                    format: wNumb({
                        mark: '.',
                        decimals: decimals
                    })

                }).on('change', function() {

                    $(".fake-layer").remove();

                    var lock = thisContent.find(".lock-btn.active").length;
                    var lockedIdArray = [];

                    if(lock){

                        thisContent.find(".yp-option-group").each(function(){
                            lockedIdArray.push($(this).attr("data-css"));
                        });

                        var val = $(this).val();

                        for(var y = 0;y < lockedIdArray.length; y++){
                            $('#yp-' + lockedIdArray[y]).val(val);
                            $('#' + lockedIdArray[y] + '-after').trigger("keyup");
                            slide_action($("#yp-" + lockedIdArray[y]), lockedIdArray[y], true, false);
                        }

                        option_change();

                    }else{
                        slide_action($(this), id, true, true);
                    }

                }).on('slide', function() {

                    // Be sure its hidden.
                    hide_frame_ui(200);

                    var lock = thisContent.find(".lock-btn.active").length;
                    var lockedIdArray = [];

                    if(lock){
                        thisContent.find(".yp-option-group").each(function(){
                            lockedIdArray.push($(this).attr("data-css"));
                        });
                    }

                    // Get val
                    var val = $(this).val();
                    var prefix = $('#' + id+"-after").val();
                    var y;

                    val = Number((parseFloat(val)).toFixed(2));
                    var left = $("#" + id + "-group").find(".wqNoUi-origin").css("left");

                    // Update the input.
                    if(lock === 0){
                        $('#' + id + '-value').val(val);
                    }else{
                        for(y = 0;y < lockedIdArray.length; y++){
                            $('#' + lockedIdArray[y] + '-value').val(val);
                            $('#' + lockedIdArray[y] + '-after').val(prefix);
                            $('#' + lockedIdArray[y] + '-group').find(".wqNoUi-origin").css("left",left);
                        }
                    }

                    // some rules not support live css, so we check some rules.
                    if (id != 'background-parallax-speed' && id != 'background-parallax-x') {

                        prefix = $(this).parent().find("#" + id + "-after").val();

                        // Standard.
                        if(lock === 0){
                            delete_live_css(id, false);
                            insert_live_css(id, val + prefix, false);
                        }else{
                            for(y = 0;y < lockedIdArray.length; y++){
                                delete_live_css(lockedIdArray[y], false);
                                insert_live_css(lockedIdArray[y], val + prefix, false);
                            }
                        }


                    } else { // for make it as live, inserting css to data.
                        slide_action($(this), id, true, true);
                    }

                    if($(".fake-layer").length === 0){
                        mainBody.append("<div class='fake-layer'></div>");
                    }

                });

            }

            /* ---------------------------------------------------- */
            /* Slider Event                                         */
            /* ---------------------------------------------------- */
            function slide_action(element, id, $slider,changed) {

                var css = element.parent().parent().data("css");
                element.parent().parent().addClass("reset-enable");

                var val;

                if ($slider === true) {

                    val = element.val();

                    // If active, disable it.
                    element.parent().parent().find(".yp-btn-action.active").trigger("click");

                } else {

                    val = element.parent().find("#" + css + "-value").val();

                }

                var css_after = element.parent().find("#" + css + "-after").val();

                // Set for demo
                insert_rule(null, id, val, css_after);

                // Option Changed
                if(changed){
                    option_change();
                }

            }

            function escape(s) {
                return ('' + s) /* Forces the conversion to string. */
                    .replace(/\\/g, '\\\\') /* This MUST be the 1st replacement. */
                    .replace(/\t/g, '\\t') /* These 2 replacements protect whitespaces. */
                    .replace(/\n/g, '\\n')
                    .replace(/\u00A0/g, '\\u00A0') /* Useful but not absolutely necessary. */
                    .replace(/&/g, '\\x26') /* These 5 replacements protect from HTML/XML. */
                    .replace(/'/g, '\\x27')
                    .replace(/"/g, '\\x22')
                    .replace(/</g, '\\x3C')
                    .replace(/>/g, '\\x3E');
            }

            /* ---------------------------------------------------- */
            /* Getting radio val.                                   */
            /* ---------------------------------------------------- */
            function radio_value(the_id, $n, data) {

                var id_prt = the_id.parent().parent();

                // for none btn
                id_prt.find(".yp-btn-action.active").trigger("click");

                if (data == id_prt.find(".yp-none-btn").text()) {
                    id_prt.find(".yp-none-btn").trigger("click");
                }

                if (data == 'auto auto') {
                    data = 'auto';
                }

                if (data != '' && typeof data != 'undefined') {

                    if (data.match(/\bauto\b/g)) {
                        data = 'auto';
                    }

                    if (data.match(/\bnone\b/g)) {
                        data = 'none';
                    }

                    if ($("input[name=" + $n + "][value=" + escape(data) + "]").length > 0) {

                        the_id.find(".active").removeClass("active");

                        $("input[name=" + $n + "][value=" + escape(data) + "]").prop('checked', true).parent().addClass("active");

                    } else {

                        the_id.find(".active").removeClass("active");

                        // Disable all.
                        $("input[name=" + $n + "]").each(function() {

                            $(this).prop('checked', false);

                        });

                        id_prt.find(".yp-none-btn:not(.active)").trigger("click");

                    }

                }

            }

            /* ---------------------------------------------------- */
            /* Radio Event                                          */
            /* ---------------------------------------------------- */
            function radio_option(id) {

                $("#yp-" + id + " label").on('click', function() {

                    if($(".position-option.active").length === 0){
                        if($(this).parent().hasClass("active")){
                            return false;
                        }
                    }

                    // Disable none.
                    $(this).parent().parent().parent().parent().find(".yp-btn-action.active").removeClass("active");
                    $(this).parent().parent().parent().parent().addClass("reset-enable").css("opacity", 1);

                    $("#yp-" + id).find(".active").removeClass("active");

                    $(this).parent().addClass("active");

                    $("#" + $(this).attr("data-for")).prop('checked', true);

                    var val = $("input[name=" + id + "]:checked").val();

                    // Set for demo
                    insert_rule(null, id, val, '');

                    // Option Changed
                    option_change();

                });

            }

            /* ---------------------------------------------------- */
            /* Check if is safe font family.                        */
            /* ---------------------------------------------------- */
            function is_safe_font(a) {

                if(isUndefined(a)){
                    return false;
                }

                var regex = /\barial\b|\barial black\b|\barial narrow\b|\barial rounded mt bold\b|\bavant garde\b|\bcalibri\b|\bcandara\b|\bcentury gothic\b|\bfranklin gothic medium\b|\bgeneva\b|\bfutura\b|\bgill sans\b|\bhelvetica neue\b|\bimpact\b|\blucida grande\b|\boptima\b|\bsegoe ui\b|\btahoma\b|\btrebuchet ms\b|\bverdana\b|\bbig caslon\b|\bbodoni mt\b|\bbook antiqua\b|\bcalisto mt\b|\bcambria\b|\bdidot\b|\bgaramond\b|\bgeorgia\b|\bgoudy old style\b|\bhoefler text\b|\blucida bright\b|\bpalatino\b|\bperpetua\b|\brockwell\b|\brockwell extra bold\b|\bbaskerville\b|\btimes new roman\b|\bconsolas\b|\bcourier new\b|\blucida console\b|\bhelveticaneue\b/;

                var data = a.toLowerCase();

                return regex.test(data);

            }


            /* ---------------------------------------------------- */
            /* Warning System                                       */
            /* ---------------------------------------------------- */

            // Margin : display inline / negative margin warnings
            $("#margin-left-group,#margin-right-group,#margin-top-group,#margin-bottom-group").on("mousemove", function(e) {

                // Stop if not orginal
                if (!e.originalEvent) {
                    return true;
                }

                // Destroy
                $(this).popover("destroy");

                // Show display warning
                if (get_selected_element().css("display") == "inline" || get_selected_element().css("display") == "table-cell") {

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_display_notice,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                // Show negative margin value warning if not responsive
                } else if($("#"+$(this).attr("data-css")+"-value").val() < 0) {

                    // don't show if orginal value
                    if($(this).hasClass("reset-enable") == false && $(this).find(".wqNoUi-active").length == 0){
                        return true;
                    }

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_negative_margin_notice,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                }

            });
            
            
            // Width / Padding : display inline warning
            $("#scale-transform-group,#rotate-transform-group,#rotatex-transform-group,#rotatey-transform-group,#rotatez-transform-group,#translate-x-transform-group,#translate-y-transform-group,#skew-x-transform-group,#skew-y-transform-group,#perspective-group,#padding-left-group,#padding-right-group,#padding-top-group,#padding-bottom-group,#width-group,#height-group").on("mousemove", function(e) {

                // Stop if not orginal
                if (!e.originalEvent) {
                    return true;
                }

                // Destroy
                $(this).popover("destroy");

                // Display warning
                if (get_selected_element().css("display") == "inline") {

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_display_notice,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                }

            });


            // Show responsive notice one time.
            $(".yp-responsive-btn").click(function(){

                var resBtn = $(".yp-responsive-btn");

                // Opened && not showed before
                if(resBtn.hasClass("active") == false && mainBody.hasClass("yp-responsive-notice-showed") == false){

                    // 500ms wait
                    setTimeout(function(){

                        if(resBtn.hasClass("active") == false){

                            // Destory
                            $('.responsive-right-handle').tooltip("destroy");

                            // Install
                            $('.responsive-right-handle').tooltip({
                                title: l18_responsive_notice,
                                animation: true,
                                placement: 'right',
                                trigger: 'manual',
                                container: "body",
                                html: true
                            }).tooltip("show");

                            // Added: showed class
                            mainBody.addClass("yp-responsive-notice-showed");

                        }

                    },500);

                    // Hide after 6s
                    setTimeout(function(){
                        $('.responsive-right-handle').tooltip("hide");
                    },6000);

                }else{

                    // Hide
                    $('.responsive-right-handle').tooltip("hide");

                }

            });


            // Hide responsive tool notice if mouse over the right resizer handle.
            $(".responsive-right-handle").on("mouseover",function(){
                $(this).tooltip("hide");
            });
            


            // position: top left right bottom = 120 > not good.
            $("#left-group,#right-group,#top-group,#bottom-group").on("mousemove", function(e) {

                // Stop if not orginal
                if (!e.originalEvent) {
                    return true;
                }

                // Show notice just for desktop mode.
                if(mainBody.hasClass("yp-responsive-device-mode")){
                    return true;
                }

                // don't show if orginal value
                if($(this).hasClass("reset-enable") == false && $(this).find(".wqNoUi-active").length == 0){
                    return true;
                }

                // Destroy
                $(this).popover("destroy");

                // high value warning
                if($("#"+$(this).attr("id").replace("group","value")).val() >= 120) {

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_high_position_notice,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                }

            });

            
            // Fixed and absolute not recommended.
            $("#position-group").on("mousemove click", function(e) {

                // Stop if not orginal
                if (!e.originalEvent) {
                    return true;
                }

                // Destroy
                $(this).popover("destroy");

                // Show notice just for desktop mode.
                if(mainBody.hasClass("yp-responsive-device-mode")){
                    return true;
                }

                // don't show if orginal value
                if($(this).hasClass("reset-enable") == false && $(this).find(".wqNoUi-active").length == 0){
                    return true;
                }


                // fixed warning
                if($(".yp-radio.active #position-fixed").length > 0) {

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_fixed_notice,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                // absolute warning
                } else if($(".yp-radio.active #position-absolute").length > 0) {

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_absolute_notice,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                }

            });


            // Parallax feature need to a background image.
            $(".background-parallax-div,#background-size-group,#background-repeat-group,#background-blend-mode-group,#background-attachment-group,#background-position-group").on("mousemove", function(e) {

                // Stop if not orginal
                if (!e.originalEvent) {
                    return true;
                }

                // Destroy
                $(this).popover("destroy");

                // show warning if not have a blackground image
                if ($("#yp-background-image").val() == '' || $("#background-image-group .yp-none-btn.active").length === 1) {

                    $(this).popover({
                        animation: false,
                        title: l18_notice,
                        content: l18_bg_img_notice_two,
                        trigger: 'hover',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                }

            });


            // Show a warning when open animation section. 
            $(".animation-option").on("click", function(e){

                // Stop if not orginal
                if (!e.originalEvent) {
                    return true;
                }

                // El
                var t = $("#animation-name-group");

                // stop if not active
                if(!$(this).hasClass("active")){
                    t.popover("destroy");
                    return true;
                }

                // Display warning
                if (get_selected_element().css("display") == "inline") {

                    t.popover({
                        animation: false,
                        title: l18_warning,
                        content: l18_display_notice,
                        trigger: 'click',
                        placement: "left",
                        container: ".yp-select-bar",
                        html: true
                    }).popover("show");

                // else destroy
                } else {
                    t.popover("destroy");
                }

            });


            // Destroy after disable.
            $(".yp-disable-btn").on("click",function(){
                $(this).parents(".yp-option-group").popover("destroy");
            });


            // Hide while editor options scrolling
            $(".yp-editor-list").on("scroll",function(){
                $(".yp-option-group,.yp-advanced-option").popover("hide");
            });



            /* ---------------------------------------------------- */
            /* Select li hover                                      */
            /* ---------------------------------------------------- */
            $(".input-autocomplete").keydown(function(e) {

                var code = e.keyCode || e.which;

                if (code == 38 || code == 40) {

                    $(this).parent().find(".autocomplete-div .ui-state-focus").prev().trigger("mouseout");
                    $(this).parent().find(".autocomplete-div .ui-state-focus").trigger("mouseover");

                }

                // enter
                if (code == 13) {

                    $(this).blur();

                }

            });

            // Blur select after select.
            $(document).on("click", ".autocomplete-div ul li", function() {
                $(this).parent().parent().parent().find(".ui-autocomplete-input").trigger("blur");
            });

            $(".input-autocomplete").on("blur", function(e) {

                if (window.openVal == $(this).val()) {
                    return false;
                }

            });

            $(".input-autocomplete").on("blur keyup", function(e) {

                if (window.openVal == $(this).val()) {
                    return false;
                }

                var id = $(this).parent().parent().data("css");

                $(".active-autocomplete-item").removeClass("active-autocomplete-item");
                $(this).removeClass("active");

                setTimeout(function(){
                    mainBody.removeClass("autocomplete-active");
                },300);

                delete_live_css(id, "#yp-" + id + "-test-style");

                // Disable
                $(this).parent().parent().find(".yp-btn-action.active").trigger("click");
                $("#" + id + "-group").addClass("reset-enable");

                // Font weight.
                if (id == 'font-weight') {
                    $("#yp-font-weight").css(id, $(this).val()).css("fontFamily", $("#yp-font-family").val());
                }

                // Font family
                if (id == 'font-family') {
                    $("#yp-font-family").css(id, $(this).val());
                    $("#yp-font-weight").css("fontFamily", $("#yp-font-family").val());
                }

                var val = $(this).val();

                if (id == 'font-family') {
                    if (val.indexOf(",") == -1 && val.indexOf("'") == -1 && val.indexOf('"') == -1) {
                        val = "'" + val + "'";
                    }
                }

                // Set for data
                insert_rule(null, id, val, '');

                option_change();

            });

            $(document).on("mouseover", ".autocomplete-div li", function() {

                var element = $(this);

                $(".active-autocomplete-item").removeClass("active-autocomplete-item");

                var id = element.parent().parent().attr("id").replace("yp-autocomplete-place-", "");

                    // If not current.
                    if (!element.hasClass("ui-state-focus")) {
                        return false;
                    }

                    // If not undefined.
                    if (typeof element.parent().attr("id") == 'undefined') {
                        return false;
                    }

                    // Font weight
                    if (id == 'font-weight') {

                        delete_live_css("fontWeight", "#yp-font-weight-test-style");
                        insert_live_css("fontWeight", number_filter(element.text()).replace("-", ""), "#yp-font-weight-test-style");

                    }

                    // Font family
                    if (id == 'font-family') {

                        load_near_fonts(element.parent());

                        delete_live_css("fontFamily", "#yp-font-test-style");

                        // Append test font family.
                        insert_live_css('fontFamily', "'" + element.text() + "'", "#yp-font-test-style");

                        element.css("fontFamily", element.text());

                    }


                // Font Weight
                if (id == 'font-weight') {

                    $(".autocomplete-div li").each(function() {
                        element.css("fontWeight", number_filter(element.text()).replace(/-/g, ''));
                    });

                    $(".autocomplete-div li").css("fontFamily", $("#yp-font-family").val());
                }

            });


            function get_multiple_delay(duration,delay){

                if(isUndefined(duration) || isUndefined(delay)){
                    return false;
                }

                var resultDelay = 0;
                var durationArray = duration.toString().split(",");
                var delayArray = delay.toString().split(",");

                if(durationArray.length != delayArray.length){
                    return false;
                }

                if(durationArray.length <= 1){
                    return false;
                }

                var currents = 0;
                for(var i = 0; i < durationArray.length; i++){
                    if(isDefined(delayArray[i+1])){
                        currents = currents + parseFloat(duration_ms(durationArray[i]));
                        resultDelay = (parseFloat(duration_ms(delayArray[i+1])) - currents) + resultDelay;
                        currents = currents + resultDelay;
                    }
                }

                return resultDelay;

            }


            // If mouseout, stop clear time out.
            $(document).on("mouseout", ".autocomplete-div", function() {

                delete_live_css("fontFamily", "#yp-font-test-style");

            });

            // If mouseout, leave.
            $(document).on("mouseleave", $(document), function() {

                if(body.hasClass("yp-mouseleave")){
                    return false;
                }

                body.addClass("yp-mouseleave");

                // remove multiple selection support.
                body.removeClass("yp-control-key-down");
                iframe.find(".yp-multiple-selected").removeClass("yp-multiple-selected");
                iframe.find(".yp-selected-others-multiable-box").remove();

                if(is_content_selected() === false){
                    clean();
                }

            });

            // If mouseenter.
            $(document).on("mouseenter", $(document), function() {

                body.removeClass("yp-mouseleave");

                // remove multiple selection support.
                body.removeClass("yp-control-key-down");
                iframe.find(".yp-multiple-selected").removeClass("yp-multiple-selected");
                iframe.find(".yp-selected-others-multiable-box").remove();

            });


            // If mouseout, leave.
            iframe.on("mouseleave", iframe, function() {

                if(body.hasClass("yp-iframe-mouseleave")){
                    return false;
                }

                body.addClass("yp-iframe-mouseleave");

                // remove multiple selection support.
                body.removeClass("yp-control-key-down");
                iframe.find(".yp-multiple-selected").removeClass("yp-multiple-selected");
                iframe.find(".yp-selected-others-multiable-box").remove();

            });

            // If mouseenter.
            iframe.on("mouseenter", iframe, function() {

                body.removeClass("yp-iframe-mouseleave");

            });


            function load_near_fonts(t){

                var element = t.find(".ui-state-focus");

                if(element.length === 0){
                    element = t.find(".active-autocomplete-item");
                }

                var prev = element.prevAll().slice(0,6);
                var next = element.nextAll().slice(0,6);

                var all = prev.add(next).add(element);

               all.each(function() {

                    var element = $(this);

                    var styleAttr = element.attr("style");

                    if (isDefined(styleAttr)){
                        return true;
                    }

                    var $activeFont = iframe.find(".yp-font-test-style").data("family");

                    var $fid = get_basic_id($.trim(element.text().replace(/ /g, '+')));

                    if (is_safe_font(element.text()) === false && iframe.find(".yp-font-test-" + $fid).length === 0 && $activeFont != element.text()) {

                        iframeBody.append("<link rel='stylesheet' class='yp-font-test-" + $fid + "'  href='https://fonts.googleapis.com/css?family=" + $.trim(element.text().replace(/ /g, '+')) + ":300italic,300,400,400italic,500,500italic,600,600italic,700,700italic' type='text/css' media='all' />");

                        // Append always to body.
                        mainBody.append("<link rel='stylesheet' class='yp-font-test-" + $fid + "'  href='https://fonts.googleapis.com/css?family=" + $.trim(element.text().replace(/ /g, '+')) + ":300italic,300,400,400italic,500,500italic,600,600italic,700,700italic' type='text/css' media='all' />");

                    }

                    element.css("fontFamily", element.text());

                });

            }

            // Loading fonts on font family hover.
            $("#yp-autocomplete-place-font-family > ul").bind('scroll', function() {

                load_near_fonts($(this));

            }); 


            // Toggle options.
            $(".wf-close-btn-link").click(function(e) {
                if ($(".yp-editor-list > li.active:not(.yp-li-about):not(.yp-li-footer)").length > 0) {
                    e.preventDefault();
                    $(".yp-editor-list > li.active:not(.yp-li-about):not(.yp-li-footer) > h3").trigger("click");
                }
            });

            /* Creating live CSS for color, slider and font-family and weight. */
            function insert_live_css(id, val, custom) {

                var selector = get_current_selector();

                // Set parent element as current
                if(id == 'perspective'){

                    // Cache current
                    var oldSelector = selector;

                    // clean cache
                    body.removeAttr("data-clickable-select");

                    // Update selector var
                    selector = $.trim(get_parents(get_selected_element().parent(), "defaultS"));

                    // set old as cache again
                    body.attr("data-clickable-select",oldSelector);

                }

                // Adds relative automatics
                if(id == 'top' || id == 'left' || id == 'right' ||id == 'bottom'){

                    // If is static
                    if($(".yp-radio.active #position-static").length > 0){

                        // Insert position relative
                        insert_rule(null, "position", "relative", '');
                        $("#position-group .yp-radio.active").removeClass("active");
                        $("#position-relative").parent().addClass("active");

                    }

                }


                // Checks min height and min width and update.
                if(id == 'height' || id == 'width'){

                    // minValue & minFormat
                    var minVal = number_filter($("#min-"+id+"-value").val());
                    var prefix = $("#"+id+"-after").val();
                    var minFormat = $("#min-"+id+"-after").val();

                    // if height is smaller than min-height, so update min height
                    if(parseFloat(val) < parseFloat(minVal) && prefix == minFormat){

                        // Insert min-height
                        delete_live_css('min-'+id,false);
                        insert_live_css('min-'+id,val,false);

                    }

                }


                // Responsive helper
                var mediaBefore = create_media_query_before(null);
                var mediaAfter = create_media_query_after();

                // Style id
                var styleId;
                if (custom !== false) {
                    styleId = custom;
                } else {
                    styleId = "#" + id + "-live-css";
                }

                //Element
                var element = iframe.find(styleId);

                // Check
                if (element.length === 0) {

                    var idAttr = styleId.replace('#', '').replace('.', '');

                    var customAttr = '';

                    // For font family.
                    if (id == 'font-family') {
                        customAttr = "data-family='" + val + "'";
                    }

                    // not use prefix (px,em,% etc)
                    if (id == 'z-index' || id == 'opacity') {
                        val = parseFloat(val);
                    }


                    // Filter Default options.
                    if (id == 'blur-filter' || id == 'grayscale-filter' || id == 'brightness-filter' || id == 'contrast-filter' || id == 'hue-rotate-filter' || id == 'saturate-filter' || id == 'sepia-filter') {

                        id = 'filter';
                        idAttr = 'filter';

                        val = filter_generator(false);

                    }
                    // Filter options end

                    // Transform Settings
                    if (id.indexOf("-transform") != -1 && id != 'text-transform' && id != '-webkit-transform') {

                        id = 'transform';
                        idAttr = 'transform';

                        val = transform_generator(false);
                        

                    }
                    // Transform options end


                    // Box Shadow
                    if (id == 'box-shadow-inset' || id == 'box-shadow-color' || id == 'box-shadow-vertical' || id == 'box-shadow-blur-radius' || id == 'box-shadow-spread' || id == 'box-shadow-horizontal') {

                        id = 'box-shadow';
                        idAttr = 'box-shadow';

                        val = box_shadow_generator();
                        

                    }
                    // Box shadow options end


                    // Append
                    if(id == 'filter' || id == 'transform'){ // Webkit support

                        iframeBody.append("<style class='" + idAttr + " yp-live-css' id='" + idAttr + "' " + customAttr + ">" + mediaBefore + ".yp-selected,.yp-selected-others," + selector + "{" + id + ":" + val + " !important;-webkit-" + id + ":" + val + " !important;}" + mediaAfter + "</style>");

                    }else{ // default

                        iframeBody.append("<style class='" + idAttr + " yp-live-css' id='" + idAttr + "' " + customAttr + ">" + mediaBefore + ".yp-selected,.yp-selected-others," + selector + "{" + id + ":" + val + " !important;}" + mediaAfter + "</style>");

                    }

                }

            }


            function transform_generator(type){

                // Getting all other options.
                var scale = "scale(" + $.trim($("#scale-transform-value").val()) + ")";
                var rotate = "rotate(" + $.trim($("#rotate-transform-value").val()) + "deg)";
                var rotatex = "rotateX(" + $.trim($("#rotatex-transform-value").val()) + "deg)";
                var rotatey = "rotateY(" + $.trim($("#rotatey-transform-value").val()) + "deg)";
                var rotatez = "rotateZ(" + $.trim($("#rotatez-transform-value").val()) + "deg)";
                var translateX = "translatex(" + $.trim($("#translate-x-transform-value").val()) + "px)";
                var translateY = "translatey(" + $.trim($("#translate-y-transform-value").val()) + "px)";
                var skewX = "skewx(" + $.trim($("#skew-x-transform-value").val()) + "deg)";
                var skewY = "skewy(" + $.trim($("#skew-y-transform-value").val()) + "deg)";

                // Check if disable or not
                if ($("#scale-transform-group .yp-disable-btn").hasClass("active")) {
                    scale = '';
                }

                if ($("#rotate-transform-group .yp-disable-btn").hasClass("active")) {
                    rotate = '';
                }

                if ($("#rotatex-transform-group .yp-disable-btn").hasClass("active")) {
                    rotatex = '';
                }

                if ($("#rotatey-transform-group .yp-disable-btn").hasClass("active")) {
                    rotatey = '';
                }

                if ($("#rotatez-transform-group .yp-disable-btn").hasClass("active")) {
                    rotatez = '';
                }

                if ($("#translate-x-transform-group .yp-disable-btn").hasClass("active")) {
                    translateX = '';
                }

                if ($("#translate-y-transform-group .yp-disable-btn").hasClass("active")) {
                    translateY = '';
                }

                if ($("#skew-x-transform-group .yp-disable-btn").hasClass("active")) {
                    skewX = '';
                }

                if ($("#skew-y-transform-group .yp-disable-btn").hasClass("active")) {
                    skewY = '';
                }

                // Dont insert if no data.
                if (scale == 'scale()' || ($("#scale-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        scale = '';
                    } else {
                        scale = 'scale(1)';
                    }

                }

                if (rotate == 'rotate(deg)' || ($("#rotate-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        rotate = '';
                    } else {
                        rotate = 'rotate(0deg)';
                    }

                }

                if (rotatex == 'rotateX(deg)' || ($("#rotatex-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        rotatex = '';
                    } else {
                        rotatex = 'rotateX(0deg)';
                    }

                }

                if (rotatey == 'rotateY(deg)' || ($("#rotatey-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        rotatey = '';
                    } else {
                        rotatey = 'rotateY(0deg)';
                    }

                }

                if (rotatez == 'rotateZ(deg)' || ($("#rotatez-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        rotatez = '';
                    } else {
                        rotatez = 'rotateZ(0deg)';
                    }

                }

                if (translateX == 'translatex(px)' || ($("#translate-x-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        translateX = '';
                    } else {
                        translateX = 'translatex(0px)';
                    }

                }

                if (translateY == 'translatey(px)' || ($("#translate-y-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        translateY = '';
                    } else {
                        translateY = 'translatey(0px)';
                    }

                }

                if (skewX == 'skewx(deg)' || ($("#skew-x-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        skewX = '';
                    } else {
                        skewX = 'skewx(0deg)';
                    }

                }

                if (skewY == 'skewy(deg)' || ($("#skew-y-transform-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        skewY = '';
                    } else {
                        skewY = 'skewy(0deg)';
                    }

                }

                // All data.
                var translateData = $.trim(scale + " " + rotate + " " + rotatex + " " + rotatey + " " + rotatez + " " + translateX + " " + translateY + " " + skewX + " " + skewY);

                if (translateData === '' || translateData == ' ') {
                    translateData = 'disable';
                    body.removeClass("yp-has-transform");
                }

                return translateData;

            }


            function filter_generator(type){

                // Getting all other options.
                var blur = "blur(" + $.trim($("#blur-filter-value").val()) + "px)";
                var grayscale = "grayscale(" + $.trim($("#grayscale-filter-value").val()) + ")";
                var brightness = "brightness(" + $.trim($("#brightness-filter-value").val()) + ")";
                var contrast = "contrast(" + $.trim($("#contrast-filter-value").val()) + ")";
                var hueRotate = "hue-rotate(" + $.trim($("#hue-rotate-filter-value").val()) + "deg)";
                var saturate = "saturate(" + $.trim($("#saturate-filter-value").val()) + ")";
                var sepia = "sepia(" + $.trim($("#sepia-filter-value").val()) + ")";

                // Check if disable or not
                if ($("#blur-filter-group .yp-disable-btn").hasClass("active")) {
                    blur = '';
                }

                if ($("#grayscale-filter-group .yp-disable-btn").hasClass("active")) {
                    grayscale = '';
                }

                if ($("#brightness-filter-group .yp-disable-btn").hasClass("active")) {
                    brightness = '';
                }

                if ($("#contrast-filter-group .yp-disable-btn").hasClass("active")) {
                    contrast = '';
                }

                if ($("#hue-rotate-filter-group .yp-disable-btn").hasClass("active")) {
                    hueRotate = '';
                }

                if ($("#saturate-filter-group .yp-disable-btn").hasClass("active")) {
                    saturate = '';
                }

                if ($("#sepia-filter-group .yp-disable-btn").hasClass("active")) {
                    sepia = '';
                }

                // Dont insert if no data.
                if (blur == 'blur(px)' || ($("#blur-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        blur = '';
                    } else {
                        blur = 'blur(0px)';
                    }

                }

                if (grayscale == 'grayscale()' || ($("#grayscale-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        grayscale = '';
                    } else {
                        grayscale = 'grayscale(0)';
                    }

                }

                if (brightness == 'brightness()' || ($("#brightness-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        brightness = '';
                    } else {
                        brightness = 'brightness(1)';
                    }

                }

                if (contrast == 'contrast()' || ($("#contrast-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        contrast = '';
                    } else {
                        contrast = 'contrast(1)';
                    }

                }

                if (hueRotate == 'hue-rotate(deg)' || ($("#hue-rotate-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        hueRotate = '';
                    } else {
                        hueRotate = 'hue-rotate(0deg)';
                    }

                }

                if (saturate == 'saturate()' || ($("#saturate-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        saturate = '';
                    } else {
                        saturate = 'saturate(0)';
                    }

                }

                if (sepia == 'sepia()' || ($("#sepia-filter-group").hasClass("reset-enable") === false && type === true)) {

                    if (is_animate_creator() === false) {
                        sepia = '';
                    } else {
                        sepia = 'sepia(0)';
                    }

                }

                // All data.
                var filterData = $.trim(blur + " " + brightness + " " + contrast + " " + grayscale + " " + hueRotate + " " + saturate + " " + sepia);

                if (filterData === '' || filterData == ' ') {
                    filterData = 'disable';
                }

                return filterData;

            }


            function box_shadow_generator(){

                // Get inset option
                var inset = '';
                if ($("#box-shadow-inset-inset").parent().hasClass("active")) {
                    inset = 'inset';
                }

                        // Getting all other options.
                var color = $.trim($("#yp-box-shadow-color").val());
                var vertical = $.trim($("#yp-box-shadow-vertical").val());
                var radius = $.trim($("#yp-box-shadow-blur-radius").val());
                var spread = $.trim($("#yp-box-shadow-spread").val());
                var horizontal = $.trim($("#yp-box-shadow-horizontal").val());

                if ($("#box-shadow-color-group .yp-disable-btn").hasClass("active") || $("#box-shadow-color-group .yp-none-btn").hasClass("active")) {
                    color = 'transparent';
                }

                if ($("#box-shadow-vertical-group .yp-disable-btn").hasClass("active")) {
                    vertical = '0';
                }

                if ($("#box-shadow-blur-radius-group .yp-disable-btn").hasClass("active")) {
                    radius = '0';
                }

                if ($("#box-shadow-spread-group .yp-disable-btn").hasClass("active")) {
                    spread = '0';
                }

                if ($("#box-shadow-horizontal-group .yp-disable-btn").hasClass("active")) {
                    horizontal = '0';
                }

                var shadowData = $.trim(horizontal + "px " + vertical + "px " + radius + "px " + spread + "px " + color + " " + inset);

                if(horizontal == 0 && vertical == 0 && radius == 0 && spread == 0){
                    shadowData = 'none';
                }

                if(color == 'transparent'){
                    shadowData = 'none';
                }

                return shadowData;

            }


            /* Removing created live CSS */
            function delete_live_css(id, custom) {

                // Style id
                var styleId;
                if (custom !== false) {
                    styleId = custom;
                } else {
                    styleId = "#" + id + "-live-css";
                }

                var element = iframe.find(styleId);

                if (element.length > 0) {
                    element.remove();
                }

            }

            // Iris color picker creating live css on mousemove
            mainDocument.on("mousemove", function(){

                var element,css,val;

                if ($(".iris-dragging").length > 0) {

                    element = $(".iris-dragging").parents(".yp-option-group");

                    css = element.data("css");
                    val = element.find(".wqcolorpicker").val();

                    delete_live_css(css, false);
                    insert_live_css(css, val, false);


                    if($(".fake-layer").length === 0){
                        mainBody.append("<div class='fake-layer'></div>");
                    }

                }

                if ($(".iris-slider").find(".ui-state-active").length > 0) {

                    element = $(".iris-slider").find(".ui-state-active").parents(".yp-option-group");

                    css = element.data("css");
                    val = element.find(".wqcolorpicker").val();

                    delete_live_css(css, false);
                    insert_live_css(css, val, false);

                    if($(".fake-layer").length === 0){
                        mainBody.append("<div class='fake-layer'></div>");
                    }

                }

                if ($(".cs-alpha-slider").find(".ui-state-active").length > 0) {

                    element = $(".cs-alpha-slider").find(".ui-state-active").parents(".yp-option-group");

                    css = element.data("css");
                    val = element.find(".wqcolorpicker").val();

                    delete_live_css(css, false);
                    insert_live_css(css, val, false);

                    if($(".fake-layer").length === 0){
                        mainBody.append("<div class='fake-layer'></div>");
                    }

                }

            });

            // Iris color picker creating YP Data.
            mainDocument.on("mouseup", function() {

                var element;

                if ($(document).find(".iris-dragging").length > 0) {

                    element = $(".iris-dragging").parents(".yp-option-group");

                    element.find(".wqcolorpicker").trigger("change");

                    $(".fake-layer").remove();

                } else if ($(document).find(".iris-slider .ui-state-active").length > 0) {

                    element = $(".ui-state-active").parents(".yp-option-group");

                    element.find(".wqcolorpicker").trigger("change");

                    $(".fake-layer").remove();

                } else if ($(document).find(".cs-alpha-slider .ui-state-active").length > 0) {

                    $(".fake-layer").remove();

                }

            });

            /* ---------------------------------------------------- */
            /* Color Event                                          */
            /* ---------------------------------------------------- */
            function color_option(id) {

                // Color picker on blur
                $("#yp-" + id).on("blur", function() {

                    // If empty, set disable.
                    if ($(this).val() == '') {
                        return false;
                    }

                });

                // Show picker on click
                $("#yp-" + id).on("click", function() {

                    $(this).parent().parent().find(".iris-picker").show();
                    $(this).parent().parent().parent().css("opacity", 1);

                });

                // disable to true.
                $("#" + id + "-group").find(".yp-after a").on("click", function() {
                    $(this).parent().parent().parent().css("opacity", 1);
                });

                // Update on keyup
                $("#yp-" + id).on("keydown keyup", function() {
                    $(this).parent().find(".wqminicolors-swatch-color").css("backgroundColor", $(this).val());
                });

                // Color picker on change
                $("#yp-" + id).on('change', function() {

                    var css = $(this).parent().parent().parent().data("css");
                    $(this).parent().parent().parent().addClass("reset-enable");
                    var val = $(this).val();

                    if (val.indexOf("#") == -1 && val.indexOf("rgb") == -1) {
                        val = "#" + val;
                    }

                    // Disable
                    $(this).parent().parent().find(".yp-btn-action.active").trigger("click");

                    if (val.length < 3) {
                        val = 'transparent';
                        $(this).parent().parent().find(".yp-none-btn:not(.active)").trigger("click");
                    }

                    // Set for demo
                    delete_live_css(css, false);

                    insert_rule(null, id, val, '');

                    // Update.
                    $(this).parent().find(".wqminicolors-swatch-color").css("backgroundImage", "none");

                    // Option Changed
                    option_change();

                });

            }

            /* ---------------------------------------------------- */
            /* Input Event                                          */
            /* ---------------------------------------------------- */
            function input_option(id) {

                // Keyup
                $("#yp-" + id).on('keyup', function() {

                    $(this).parent().parent().addClass("reset-enable");

                    var val = $(this).val();

                    // Disable
                    $(this).parent().find(".yp-btn-action.active").trigger("click");

                    if (val == 'none') {
                        $(this).parent().parent().find(".yp-none-btn").not(".active").trigger("click");
                        $(this).val('');
                    }

                    if (val == 'disable') {
                        $(this).parent().parent().find(".yp-disable-btn").not(".active").trigger("click");
                        $(this).val('');
                    }

                    if (id == 'background-image') {

                        val = val.replace(/\)/g, '').replace(/\url\(/g, '');

                        $(this).val(val);

                        val = 'url(' + val + ')';

                        $(".yp-background-image-show").remove();
                        var imgSrc = val.replace(/"/g, "").replace(/'/g, "").replace(/url\(/g, "").replace(/\)/g, "");

                        if (val.indexOf("yellow-pencil") == -1) {

                            if (imgSrc.indexOf("//") != -1 && imgSrc != '' && imgSrc.indexOf(".") != -1) {
                                $("#yp-background-image").after("<img src='" + imgSrc + "' class='yp-background-image-show' />");
                            }

                        }

                    }

                    // Set for demo
                    insert_rule(null, id, val, '');

                    // Option Changed
                    option_change();

                });

            }


            // Clean data that not selected yet.
            function simple_clean(){

                // Animate update
                if(body.hasClass("yp-animate-manager-active")){
                    animation_manager();
                }

                // Clean basic classes
                body.removeAttr("data-clickable-select").removeAttr("data-yp-selector").removeClass("yp-element-float yp-selector-focus yp-selector-hover yp-selector-active yp-selector-link yp-selector-visited yp-css-data-trigger yp-contextmenuopen yp-content-selected yp-body-select-just-it yp-has-transform yp-element-resizing yp-element-resizing-height-top yp-element-resizing-height-bottom yp-element-resizing-width-left yp-element-resizing-width-right");
 
                // Clean classes from selected element
                iframe.find(".yp-selected,.yp-selected-others").removeClass("ui-draggable ui-draggable-handle ui-draggable-handle yp-selected-has-transform");

                // Remove yp-selected classes
                iframe.find(".yp-selected-others,.yp-selected").removeClass("yp-selected-others").removeClass("yp-selected");

                // Remove created elements
                iframe.find(".yp-edit-style,.yp-edit-edit,.yp-edit-menu,.yp-edit-tooltip,.yp-selected-handle,.yp-selected-others-box,.yp-selected-tooltip,.yp-selected-boxed-top,.yp-selected-boxed-left,.yp-selected-boxed-right,.yp-selected-boxed-bottom,.yp-selected-boxed-margin-top,.yp-selected-boxed-margin-left,.yp-selected-boxed-margin-right,.yp-selected-boxed-margin-bottom,.selected-just-it-span,.yp-selected-boxed-padding-top,.yp-selected-boxed-padding-left,.yp-selected-boxed-padding-right,.yp-selected-boxed-padding-bottom,.yp-live-css,.yp-selected-tooltip span").remove();

                // Update
                if(mainBody.hasClass("yp-select-just-it") === false){
                    window.selectorClean = null;
                }

                // Update informations
                if($(".advanced-info-box").css("display") == 'block' && $(".element-btn").hasClass("active")){
                    $(".info-element-selected-section").hide();
                    $(".info-no-element-selected").show();
                }

                $(".yp-disable-btn.active").removeClass("active");

            }


            /* ---------------------------------------------------- */
            /* Remove data                                          */
            /* ---------------------------------------------------- */
            function clean() {

                // Use yp_simple_clean function for simple clean data.
                if(is_content_selected() === false){
                    simple_clean();
                    return false;
                }else{

                    // Stop if dragging
                    if (is_dragging()){
                        return false;
                    }


                    // Hide if close while playing an animate.
                    if(body.hasClass("yp-force-hide-select-ui")){
                        body.removeClass("yp-force-hide-select-ui yp-hide-borders-now");
                    }

                    /* this function remove menu from selected element */
                    if (iframe.find(".context-menu-active").length > 0) {
                        get_selected_element().contextMenu("hide");
                    }

                    // destroy ex element draggable feature.
                    if (iframe.find(".yp-selected.ui-draggable").length > 0){
                        get_selected_element().draggable("destroy");
                    }

                    // Clean animate buttons classes
                    if(mainBody.find(".yp-anim-cancel-link").length > 0){
                        $(".yp-anim-cancel-link").trigger("click");
                    }

                    // Clean lock button active classes
                    $(".lock-btn").removeClass("active");

                    // Clean popovers.
                    $("#margin-left-group,#margin-right-group,#margin-top-group,#margin-bottom-group,#padding-left-group,#padding-right-group,#padding-top-group,#padding-bottom-group,#background-color-group,.background-parallax-div,#background-size-group,#background-repeat-group,#background-blend-mode-group,#background-attachment-group,#background-position-group,#box-shadow-color-group,#animation-name-group").popover("destroy");

                    // close open menu
                    $(".yp-editor-list > li.active:not(.yp-li-about) > h3").trigger("click");

                    // Dont stop playing animate
                    if(mainBody.hasClass("yp-animate-manager-playing") === false){
                        iframe.find(".yp_onscreen,.yp_hover,.yp_click,.yp_focus").removeClass("yp_onscreen yp_hover yp_click yp_focus");
                    }

                    // Remove classes
                    $(".reset-enable").removeClass("reset-enable");

                    // Update panel
                    $(".yp-option-group").css("opacity", "1");
                    $(".yp-after").css("display", "block");

                    // delete cached data.
                    $("li[data-loaded]").removeAttr("data-loaded");

                    // copied by iframe click select section.
                    $(".yp-editor-list > li.active > h3").not(".yp-li-about").not(".yp-li-footer").trigger("click");

                    $(".input-autocomplete").removeAttr("style");
                    $(".yp-disable-contextmenu").removeClass("yp-disable-contextmenu");
                    $(".yp-active-contextmenu").removeClass("yp-active-contextmenu");

                    // Cancel if animater active
                    if(is_animate_creator() || mainBody.hasClass("yp-anim-link-toggle")){
                        yp_anim_cancel();
                    }

                    // Hide some elements from panel
                    $(".background-parallax-div,.yp-transform-area").hide();
                    $(".yp-on").removeClass("yp-on");

                    simple_clean();

                }

            }


            function the_editor_data(){
                return iframe.find(".yp-styles-area");
            }



            /* ---------------------------------------------------- */
            /* Getting Stylizer data                                */
            /* ---------------------------------------------------- */
            function get_editor_data() {
                var data = the_editor_data().html();
                data = data.replace(/</g, 'YP|@');
                data = data.replace(/>/g, 'YP@|');
                return data;
            }

            /* ---------------------------------------------------- */
            /* Getting CSS data                                     */
            /* ---------------------------------------------------- */
            function get_clean_css(a) {

                var data = get_css_by_screensize('desktop');

                // Adding break
                data = data.replace(/\)\{/g, "){\r").replace(/\)\{/g, "){\r");

                // Clean spaces for nth-child and not.
                var ars = Array(
                    "nth-child",
                    "not",
                    "lang",
                    "nth-last-child",
                    "nth-last-of-type",
                    "nth-of-type"
                );

                for(var ai = 0; ai < ars.length; ai++){

                    // Reg
                    var k = new RegExp(ars[ai] + "\\((.*?)\\)\{\r\r", "g");

                    // Replace
                    data = data.replace(k, ars[ai] + "\($1\)\{");

                }


                if (iframe.find(".yp_current_styles").length > 0) {

                    var mediaArray = [];

                    iframe.find(".yp_current_styles").each(function() {
                        var v = $(this).attr("data-size-mode");

                        if ($.inArray(v, mediaArray) === -1 && v != 'desktop') {
                            mediaArray.push(v);
                        }
                    });

                    $.each(mediaArray, function(i, v) {

                        var q = get_css_by_screensize(v);

                        // Add extra tab for media query content.
                        q = "\t" + q.replace(/\r/g, '\r\t').replace(/\t$/g, '').replace(/\t$/g, '');

                        if (v == 'tablet') {
                            v = '(min-width: 768px) and (max-width: 991px)';
                        }

                        if (v == 'mobile') {
                            v = '(max-width:767px)';
                        }

                        data = data + "\r\r@media " + v + "{\r\r" + q + "}";

                    });

                }

                if (a === true) {
                    data = data.replace(/\r\ta:a !important;/g, "");
                    data = data.replace(/a:a !important;/g, "");
                    data = data.replace(/a:a;/g, "");
                }

                // Clean first empty lines.
                data = data.replace(/^\r/g, '').replace(/^\r/g, '');

                data = data.replace(/\}\r\r\r\r@media/g, '}\r\r@media');

                return data;

            }

            /* ---------------------------------------------------- */
            /* Create All Css Codes For current selector            */
            /* ---------------------------------------------------- */
            function get_css_by_screensize(size) {

                if (iframe.find(".yp_current_styles").length <= 0) {
                    return '';
                }

                var totalCreated, classes, selector, data;

                totalCreated = '';

                iframe.find(".yp_current_styles:not(.yp_step_end)[data-size-mode='" + size + "']").each(function() {

                    if (!$(this).hasClass("yp_step_end")) {

                        if ($(this).first().html().indexOf("@media") != -1) {
                            data = $(this).first().html().split("{")[1] + "{" + $(this).first().html().split("{")[2].replace("}}", "}");
                        } else {
                            data = $(this).first().html();
                        }

                        data = data.replace(/\/\*(.*?)\*\//g, "");

                        selector = data.split("{")[0];

                        totalCreated += selector + "{\r";

                        classes = $(this).data("style");

                        iframe.find("style[data-style=" + classes + "][data-size-mode='" + size + "']").each(function() {

                            var datai;
                            if ($(this).first().html().indexOf("@media") != -1) {
                                datai = $(this).first().html().split("{")[1] + "{" + $(this).first().html().split("{")[2].replace("}}", "}");
                            } else {
                                datai = $(this).first().html();
                            }

                            totalCreated += "\t" + datai.split("{")[1].split("}")[0] + ';\r';

                            $(this).addClass("yp_step_end");

                        });

                        totalCreated += "}\r\r";

                        $(this).addClass("yp_step_end");

                    }

                });

                iframe.find(".yp_step_end").removeClass("yp_step_end");

                return totalCreated;

            }

            // toggle created background image.
            $("#background-image-group .yp-none-btn,#background-image-group .yp-disable-btn").click(function(e) {
                if(e.originalEvent){
                    $("#background-image-group .yp-background-image-show").toggle();
                }
            });


            // Getting MS from CSS Duration
            function duration_ms(durations){

                durations = durations.toString();
                durations = durations.replace(/ms/g,"");

                // result
                var duration = 0;
                var ms;

                // Is multi durations?
                if(durations.indexOf(",") != -1){

                    var durationsArray = durations.split(",");

                    for(var i = 0; i < durationsArray.length; i++){

                        var val = durationsArray[i];
                        
                        // Has dot?
                        if(val.indexOf(".") != -1){

                            ms = parseFloat(val).toString().split(".")[1].length;
                            val = val.replace(".","").toString();

                            if(ms == 2){
                                val = val.replace(/s/g, "0");
                            }else if(ms == 1){
                                val = val.replace(/s/g, "00");
                            }

                        }else{
                            val = val.replace(/s/g, "000");
                        }

                        duration = parseFloat(duration) + parseFloat(val);

                    }

                    return duration;

                }else{

                    // Has dot?
                    if(durations.indexOf(".") != -1){

                        ms = parseFloat(durations).toString().split(".")[1].length;
                        durations = durations.replace(".","").toString();

                        if(ms == 2){
                            durations = durations.replace(/s/g, "0");
                        }else if(ms == 1){
                            durations = durations.replace(/s/g, "00");
                        }

                    }else{
                        durations = durations.replace(/s/g, "000");
                    }

                    return durations;

                }

            }


            // Get inserted style by selector and rule.
            function get_data_value(selector,css,check,size){

                // Defaults
                var dataContentNew,value,valueDetail = false;

                // Size mean media-size.
                if(isUndefined(size)){
                    size = get_media_condition();
                }

                // replace fake rules as scale-transfrom.
                var cssData = get_css_id(css);

                // Get real css Name
                css = cssData[0];

                // scale etc.
                valueDetail = cssData[1];

                // Get current selector
                if(selector == null){
                    selector = get_current_selector();
                }

                // Selection. :hover etc.
                var selection = $('body').attr('data-yp-selector');

                if (isUndefined(selection)) {
                    selection = '';
                } else {
                    selector = add_class_to_body(selector, 'yp-selector-' + selection.replace(':', ''));
                }

                // Get ID
                selector = get_id(selector);

                // Find
                var style = iframe.find('.' + selector + '-' + css + '-style[data-size-mode="'+size+'"]');

                // If there
                if (style.length === 0){
                    return false;
                }else if(check == true){

                    if(valueDetail != null){ // if has detail

                        if(style.html().match(new RegExp(valueDetail,"g"))){
                            return true;
                        }else{
                            return false;
                        }

                    }else{ // No detail
                        return true;
                    }

                }

                // Get Data
                var dataContent = style.html();

                // get rule value by an css style string.
                return escape_data_value(dataContent);

            }


            // Getting rule value from an string as "element{color:red;}"
            function escape_data_value(data){

                // Defaults
                var value,dataNew;

                if(data === null || data === undefined || data === ''){
                    return false;
                }

                data = data.replace(/\/\*(.*?)\*\//g, "");

                // HasMedia?
                if(data.indexOf("@media") != -1){

                    // Get media content
                    dataNew = data.match(/\){(.*?)\}$/g);

                    // re check for media.
                    if(dataNew == null){
                        dataNew = data.match(/\{(.*?)\}$/g);
                    }

                }else{

                    dataNew = data;

                }

                // Value
                value = dataNew.toString().split(":")[1].split("}")[0];

                // Be sure
                if(!value){
                    return false;
                }

                // who do like important tag?.
                value = value.replace(/\s+?!important/g,'').replace(/\;$/g,'').trim();

                // return
                return value;

            }


            // Get real CSS name and replace fake rules as scale-transfrom.
            // param1 : real CSS name, param2 : [scale]-transfrom. ie "scale".
            function get_css_id(css){

                var cssDetail = null;

                // No webkit
                css = css.replace(/\-webkit\-/g,'');

                // Update transfrom parts
                if(css.indexOf("-transform") != -1 && css != 'text-transform'){

                    // CSS
                    cssDetail = css.replace(/-transform/g,'');
                    css = 'transform';
                    cssDetail = cssDetail.replace(/\-/g,"");

                }

                // Update filter parts
                if(css.indexOf("-filter") != -1){

                    // CSS
                    cssDetail = css.replace(/-filter/g,'');
                    css = 'filter';

                }

                // Update filter parts
                if(css.indexOf("box-shadow-") != -1){

                    // CSS
                    css = 'box-shadow';
                    cssDetail = css.replace(/box-shadow-/g,'');

                }

                return [css,cssDetail];

            }



            /* ---------------------------------------------------- */
            /* Set Default Option Data                              */
            /* ---------------------------------------------------- */
            function set_default_value(id) {

                // Get Selector
                var selector = get_current_selector();

                // Set parent element as current
                if(id == 'perspective'){

                    // Cache current
                    var oldSelector = selector;

                    // clean cache
                    body.removeAttr("data-clickable-select");

                    // Update selector var
                    selector = $.trim(get_parents(get_selected_element().parent(), "defaultS"));

                    // set old as cache again
                    body.attr("data-clickable-select",oldSelector);

                }

                // Get Element Object
                var the_element = iframe.find(selector);

                // Adding animation classes to element
                if (id == 'animation-name' || id == 'animation-iteration-count' || id == 'animation-duration' || id == 'animation-delay'){
                    the_element.addClass("yp_onscreen yp_hover yp_click yp_focus");
                }

                // Get styleAttr
                var styleData = the_element.attr("style");

                // Remove style attr before getting value for position id.
                if(id == 'position'){
                    if (isUndefined(styleData)) {
                        styleData = '';
                    }else{
                        the_element.removeAttr("style");
                    }
                }

                setTimeout(function() {

                    // Current media size
                    var size = get_current_media_query();

                    // Default
                    var ypEvent = '';

                        // onscreen event
                    if (iframe.find('[data-style="' + elementID + get_id(".yp_onscreen") + '"][data-size-mode="'+size+'"]').length > 0) {
                        ypEvent = 'yp_onscreen';
                    }

                    // click event
                    if (iframe.find('[data-style="' + elementID + get_id(".yp_click") + '"][data-size-mode="'+size+'"]').length > 0) {
                        ypEvent = 'yp_click';
                    }

                    // hover event
                    if (iframe.find('[data-style="' + elementID + get_id(".yp_hover") + '"][data-size-mode="'+size+'"]').length > 0) {
                        ypEvent = 'yp_hover';
                    }

                        // Focus event
                    if (iframe.find('[data-style="' + elementID + get_id(".yp_focus") + '"][data-size-mode="'+size+'"]').length > 0) {
                        ypEvent = 'yp_focus';
                    }

                    // hover event default
                    if (mainBody.hasClass("yp-selector-hover") && ypEvent == '') {
                        ypEvent = 'yp_hover';
                    }

                    // Focus event default
                    if (mainBody.hasClass("yp-selector-focus") && ypEvent == '') {
                        ypEvent = 'yp_focus';
                    }

                        // default is onscreen
                    if (isUndefined(ypEvent) || ypEvent == '') {
                        ypEvent = 'yp_onscreen';
                    }


                    // replace fake rules as scale-transfrom.
                    var ruleID = get_css_id(id);

                    // Get details
                    var elementID = ruleID[0];
                    var cssDetail = ruleID[1];

                    // Has editor style?
                    if (id == 'animation-name' || id == 'animation-iteration-count' || id == 'animation-duration' || id == 'animation-delay'){

                        if(get_data_value(selector+"."+ypEvent,id,true)){
                            $("#" + id + "-group").addClass("reset-enable");
                        }

                    }else{
                        
                        if(get_data_value(selector,id,true) && id.indexOf("-transform") == -1 && id.indexOf("box-shadow-") == -1){
                            $("#" + id + "-group").addClass("reset-enable");
                        }

                    }
                    

                    // data is default value
                    var data,numberData;

                    // Getting CSS Data. (Animation play not an CSS rule.)
                    if (id != 'animation-play' && id != 'border-width' && id != 'border-color' && id != 'border-style' && elementID != 'transform') {
                        data = the_element.css(elementID);
                        numberData = number_filter(data);
                    }

                    // If data has at CSS editor, get it
                    if(get_data_value(selector,id,true) == true){
                        data = get_data_value(selector,id,false);
                        numberData = number_filter(data);
                    }

                    // Not set auto for top and left
                    if(id == 'top' || id == 'left'){
                        if(data == 'auto'){
                            data = '0px';
                            numberData = 0;
                        }
                    }

                    // Getting format: px, em, etc.
                    var $format = alfa_filter(data).replace(/(\.|\,)/g,'');

                    // Chome return "rgba(0,0,0,0)" if no background color,
                    // its is chrome hack.
                    if (id == 'background-color' && data == 'rgba(0, 0, 0, 0)') {
                        data = 'transparent';
                    }

                    // checks
                    if(id == 'position' && data == 'relative' && styleData.indexOf("relative") != -1){
                        data = 'static';
                    }

                    // add deleted style attr again
                    if(id == 'position'){
                        if(!isUndefined(styleData)){
                            the_element.attr(styleData);
                        }
                    }

                    // Check border style
                    var top;
                    if(id == 'border-style'){

                        data = 'solid';

                        top = the_element.css("borderTopStyle");

                        if(top == the_element.css("borderLeftStyle") && top == the_element.css("borderRightStyle") && top == the_element.css("borderBottomStyle")){
                            data = top;
                        }
                        
                    }

                    // Check border width
                    if(id == 'border-width'){

                        data = '0px';
                        numberData = 0;

                        top = the_element.css("borderTopWidth");

                        if(top == the_element.css("borderLeftWidth") && top == the_element.css("borderRightWidth") && top == the_element.css("borderBottomWidth")){
                            data = top;
                            numberData = number_filter(top);
                        }
                        
                    }

                    // Check border color
                    if(id == 'border-color'){

                        data = the_element.css("color");

                        top = the_element.css("borderTopColor");

                        if(top == the_element.css("borderLeftColor") && top == the_element.css("borderRightColor") && top == the_element.css("borderBottomColor")){
                            data = top;
                        }
                        
                    }


                    // Check if margin left/right is auto or else.
                    if(id == 'margin-left' || id == 'margin-right'){

                        var frameWidth = iframe.width();

                        var marginRight = parseFloat(the_element.css("marginRight"));
                        var marginLeft = parseFloat(the_element.css("marginLeft"));
                        var width = parseFloat(the_element.css("width"));

                        if(frameWidth == (marginLeft * 2) + width){
                            data = 'auto';
                            numberData = 0;
                        }

                    }


                    // some script for custom CSS Rule: animation-play
                    if (id == 'animation-play') {
                        data = ypEvent;
                    }

                
                    // Play if is animation name.
                    if (id == 'animation-name' && data != 'none'){

                        // Add class.
                        body.addClass("yp-hide-borders-now yp-force-hide-select-ui");

                        var time = the_element.css("animationDuration");
                        var timeDelay = the_element.css("animationDelay");
                        
                        // Getting right time delay if have multiple animations.
                        var newDelay = get_multiple_delay(time,timeDelay);

                        if(newDelay !== false){
                            timeDelay = newDelay;
                        }else if(isUndefined(timeDelay)){
                            timeDelay = 0;
                        }else{
                            timeDelay = duration_ms(timeDelay); // timeDelay
                        }

                        if (isUndefined(time)){
                            time = 1000;
                        }else{
                            time = duration_ms(time); // Time
                        }
                        
                        time = parseFloat(time) + parseFloat(timeDelay);

                        if(time === 0){
                            time = 1000;
                        }

                        time = time + 100;

                        clear_animation_timer();

                        window.animationTimer2 = setTimeout(function() {

                            element_animation_end();

                            // Update.
                            draw();

                            // remove class.
                            body.removeClass("yp-hide-borders-now yp-force-hide-select-ui");

                        }, time);

                    }


                
                    // filter = explode filter data to parts
                    if (elementID == 'filter'){

                        // Try to get css with webkit prefix.
                        if (data === null || data == 'none' || data === undefined) {
                            data = the_element.css("-webkit-filter"); // for chrome.
                        }

                        // Special default values for filter css rule.
                        if (data != 'none' && data !== null && data !== undefined) {

                            // Get brightness, blur etc from filter data.
                            data = data.match(new RegExp(cssDetail+"\\((.*?)\\)","g"));

                            // is?
                            if (isDefined(data)) {

                                // replace prefixes
                                data = data.toString().replace("deg", "").replace("hue-rotate(", "").replace(")", "");

                                // Update data
                                data = number_filter(data);

                                // Update number data
                                numberData = data;

                            }else{

                                // Set default
                                data = 'disable';
                                numberData = 0;

                            }

                        }else{

                            // Set default
                            data = 'disable';
                            numberData = 0;

                        }

                    }


                    // Font weight fix.
                    if (id == 'font-weight'){

                        if(data == 'bolder'){ data = '700'; }
                        if(data == 'bold'){ data = '600'; }
                        if(data == 'normal'){ data = '400'; }
                        if(data == 'lighter'){ data = '300'; }

                    }


                    // transform = explode transform data to parts
                    if (elementID == 'transform') {

                        // Get transfrom style from editor data.
                        data = get_data_value(selector,id,size);

                        // Getting transform value from HTML Source ANIM.
                        var styleString = null;
                        if (is_animate_creator()){

                            var currentScene = parseInt(mainBody.attr("data-anim-scene").replace("scene-", ""));

                            // Check scenes by scenes for get transfrom data.
                            for(var transfromIndex = 0; transfromIndex < 6; transfromIndex++){

                                // style element
                                var styleOb = iframe.find('.scene-' + (currentScene - transfromIndex) + ' .scenes-transform-style');

                                // Get
                                if (styleOb.length > 0) {
                                    styleString = styleOb.last().html();
                                    break;
                                }

                            }

                            // Get scene transform data else default.
                            if(styleString != null){
                                data = escape_data_value(styleString);
                            }

                        } // Anim end.

                        
                        // explode transform data
                        if (data != 'none' && data !== false && data !== undefined) {

                            // Get brightness, blur etc from filter data.
                            data = data.match(new RegExp(cssDetail+"\\((.*?)\\)","g"));

                            // is?
                            if (isDefined(data)) {

                                // String.
                                data = data.toString();

                                // Update data
                                data = number_filter(data);

                                // Update number data
                                numberData = data;

                            }else{

                                // Set default
                                data = 'disable';
                                numberData = 0;

                            }

                        }else{

                            // Set default
                            data = 'disable';
                            numberData = 0;

                        }

                    }

                    // Animation creator; don't append 0s duration.
                    if (id == "animation-duration" && is_animate_creator() === true) {
                        if (data == '0s' || data == '0ms') {
                            return false;
                        }
                    }

                    // Set auto
                    if(id == 'min-width' || id == 'min-height'){
                        if(parseFloat(data) == 0){
                            data = 'auto';
                        }
                    }

                    // Check bottom and set auto
                    if (id == 'bottom') {

                        if (parseFloat(the_element.css("top")) + parseFloat(the_element.css("bottom")) === 0) {
                            data = 'auto';
                        }
                    }

                    // Check right and set auto
                    if (id == 'right') {
                        if (parseFloat(the_element.css("left")) + parseFloat(the_element.css("right")) === 0) {
                            data = 'auto';
                        }
                    }

                    // Box Shadow.
                    if (elementID == 'box-shadow' && data != 'none' && data !== null && data !== undefined) {

                        // Box shadow color default value.
                        if (id == 'box-shadow-color') {

                            // Hex
                            if (data.indexOf("#") != -1) {
                                if (data.split("#")[1].indexOf("inset") == -1) {
                                    data = $.trim(data.split("#")[1]);
                                } else {
                                    data = $.trim(data.split("#")[1].split(' ')[0]);
                                }
                            } else {
                                if (data.indexOf("rgb") != -1) {
                                    data = data.match(/rgb(.*?)\((.*?)\)/g).toString();
                                }
                            }

                        }

                        // split all box-shadow data.
                        var numbericBox = data.replace(/rgb(.*?)\((.*?)\) /g, '').replace(/ rgb(.*?)\((.*?)\)/g, '').replace(/inset /g, '').replace(/ inset/g, '');

                        // shadow horizontal value.

                        if (id == 'box-shadow-horizontal') {
                            data = numbericBox.split(" ")[0];
                            numberData = number_filter(data);
                        }

                        // shadow vertical value.
                        if (id == 'box-shadow-vertical') {
                            data = numbericBox.split(" ")[1];
                            numberData = number_filter(data);
                        }

                        // Shadow blur radius value.
                        if (id == 'box-shadow-blur-radius') {
                            data = numbericBox.split(" ")[2];
                            numberData = number_filter(data);
                        }

                        // Shadow spread value.
                        if (id == 'box-shadow-spread') {
                            data = numbericBox.split(" ")[3];
                            numberData = number_filter(data);
                        }

                    }

                    // if no info about inset, default is no.
                    if (id == 'box-shadow-inset') {

                        if (isUndefined(data)) {

                            data = 'no';

                        } else {

                            if (data.indexOf("inset") == -1) {
                                data = 'no';
                            } else {
                                data = 'inset';
                            }

                        }

                    }

                    // option element.
                    var the_option = $("#yp-" + id);

                    // option element parent of parent.
                    var id_prt = the_option.parent().parent();

                    // if special CSS, get css by CSS data.
                    // ie for parallax. parallax not a css rule.
                    // yellow pencil using css engine for parallax Property.
                    if (the_element.css(id) === undefined && iframe.find('.' + elementID + '-' + id + '-style').length > 0) {

                        data = get_data_value(selector,id);
                        numberData = number_filter(data);

                    } else if (isUndefined(the_element.css(id))) { // if no data, use "disable" for default.

                        if (id == 'background-parallax') {
                            data = 'disable';
                        }

                        if (id == 'background-parallax-speed') {
                            data = 'disable';
                        }

                        if (id == 'background-parallax-x') {
                            data = 'disable';
                        }

                    }

                    // IF THIS IS A SLIDER
                    if (the_option.hasClass("wqNoUi-target")){

                        // if has multi duration
                        if(id == 'animation-duration' && data.indexOf(",") != -1){
                            data = '1s'; // Reading as 1second
                            $format = 's';
                            numberData = '1';
                            $("#animation-duration-group").addClass("hidden-option");
                        }else if(id == 'animation-duration'){
                            $("#animation-duration-group").removeClass("hidden-option");
                        }


                        // if has multi delay
                        if(id == 'animation-delay' && data.indexOf(",") != -1){
                            data = '0s'; // Reading as 1second
                            $format = 's';
                            numberData = '0';
                            $("#animation-delay-group").addClass("hidden-option");
                        }else if(id == 'animation-delay'){
                            $("#animation-delay-group").removeClass("hidden-option");
                        }

                        // If not inline
                        if (the_element.css("display") != 'inline' || the_element.css("display").indexOf("table") != -1) {

                            // if has children and id is height 
                            if (id == 'height' && the_element.children().length > 0 && the_element.children().length < 12) {

                                var elHeight = the_element.css("height");
                                var tHeight;

                                // parent is display block
                                the_element.children().each(function(){

                                    tHeight = $(this).css("height");

                                    if(elHeight == tHeight){

                                        data = 'auto';
                                        return false;

                                    }

                                });

                            }

                        }


                        // if no data, active none option.
                        if (data == 'none' || data == 'auto' || data == 'inherit' || data == 'initial'){
                            if(id_prt.find(".yp-none-btn").hasClass("active")){
                                id_prt.find(".yp-none-btn").trigger("click").trigger("click");
                            }else{
                                id_prt.find(".yp-none-btn").trigger("click");
                            }
                            $format = 'px';
                        } else {
                            id_prt.find(".yp-none-btn.active").trigger("click"); // else disable none option.
                        }

                        $format = $.trim($format);

                        // be sure format is valid.
                        if ($format === '' || $format == 'px .px' || $format == 'px px') {
                            $format = 'px';
                        }

                        // be sure format is valid.
                        if ($format.indexOf("px") != -1) {
                            $format = 'px';
                        }

                        // Default value is 1 for transform scale.
                        if (numberData == '' && id == 'scale-transform') {
                            numberData = 1;
                        }

                        // Default value is 1 for filter
                        if (numberData == '' && id == 'brightness-filter') {
                            numberData = 1;
                        }

                        // Default value is 1 for filter
                        if (numberData == '' && id == 'contrast-filter') {
                            numberData = 1;
                        }

                        // Default value is 1 for filter
                        if (numberData == '' && id == 'saturate-filter') {
                            numberData = 1;
                        }

                        // default value is 1 for opacity.
                        if (numberData == '' && id == 'opacity') {
                            numberData = 1;
                        }

                        // If no data, set zero value.
                        if (numberData == '') {
                            numberData = 0;
                        }

                        var range = id_prt.data("px-range").split(",");

                        var $min = parseInt(range[0]); // mininum value
                        var $max = parseInt(range[1]); // maximum value

                        // Check values.
                        if (numberData < $min) {
                            $min = numberData;
                        }

                        if (numberData > $max) {
                            $max = numberData;
                        }

                        // Speacial max and min limits for CSS size rules.
                        if (id == 'width' || id == 'max-width' || id == 'min-width' || id == 'height' || id == 'min-height' || id == 'max-height') {
                            $max = parseInt($max) + (parseInt($max) * 1.5);
                            $min = parseInt($min) + (parseInt($min) * 1.5);
                        }

                        // if width/height is same with windows width, set 100%!
                        // Note: browsers always return value in PX format.
                        if (the_element.css("display") != 'inline') {

                            // Width
                            if (id == 'width' && the_element.parent().length > 0) {

                                // is px and display block
                                if($format == 'px' && the_element.parent().css("display") != 'inline' && the_element.parent().css("display") != 'inline-flex' && the_element.parent().css("display").indexOf("table") == -1){

                                    var parentWidth = the_element.parent().width();

                                    // if width is same with parent width, so set 100%!
                                    if (parentWidth == parseInt(numberData)) {
                                        numberData = '100';
                                        $format = '%';
                                    }

                                    // if width is 50% of parent width, so set 50%!
                                    if (parseInt(parentWidth/2) == (parseInt(numberData))) {
                                        numberData = '50';
                                        $format = '%';
                                    }

                                    // if width is 25% of parent width, so set 25%!
                                    if (parseInt(parentWidth/4) == (parseInt(numberData))) {
                                        numberData = '25';
                                        $format = '%';
                                    }

                                    // if width is 20% of parent width, so set 20%!
                                    if (parseInt(parentWidth/5) == (parseInt(numberData))) {
                                        numberData = '20';
                                        $format = '%';
                                    }

                                }

                            }

                            // if  height is 100% of window height!
                            if (id == 'height' && parseInt($(window).height()) == parseInt(numberData) && $format == 'px') {
                                numberData = '100';
                                $format = 'vh';
                            }

                        }

                        // max and min for %.
                        if ($format == '%'){
                            range = $('#' + id + '-group').attr("data-pcv").split(",");
                            $min = range[0];
                            $max = range[1];
                        }else if($format == 'em'){
                            range = $('#' + id + '-group').attr("data-emv").split(",");
                            $min = range[0];
                            $max = range[1];
                        }

                        // Raund
                        numberData = Math.floor(numberData * 100) / 100;

                        the_option.wqNoUiSlider({
                            range: {
                                'min': parseInt($min),
                                'max': parseInt($max)
                            },
                            start: parseFloat(numberData)
                        }, true);

                        // Set new value.
                        the_option.val(numberData);

                        // Update the input.
                        $('#' + id + '-value').val(numberData);

                        $format = $format.replace(/\./g,'');

                        // set format of value. px, em etc.
                        $("#" + id + "-after").val($format);

                        return false;

                        // IF THIS IS A SELECT TAG
                    } else if (the_option.hasClass("input-autocomplete")) {

                        // Checking font family settings.
                        if (id == 'font-family' && typeof data != 'undefined') {

                            data = $.trim(data.replace(/"/g, "").replace(/'/g, ""));

                        }

                        if (isDefined(data)) {

                            // Set CSS For this selected value. example: set font-family for this option.
                            id_prt.find("#yp-" + id).css(id, data);

                            // Append default font family to body. only for select font family.
                            if ($(".yp-font-test-" + get_basic_id($.trim(data.replace(/ /g, '+')))).length === 0 && id == 'font-family') {

                                // If safe font, stop.
                                if (is_safe_font(data) === false) {

                                    // Be sure its google font.
                                    if (is_google_font(data)) {

                                        // Append always to body.
                                        body.append("<link rel='stylesheet' class='yp-font-test-" + get_basic_id($.trim(data.replace(/ /g, '+'))) + "'  href='https://fonts.googleapis.com/css?family=" + $.trim(data.replace(/ /g, '+')) + ":300italic,300,400,400italic,500,500italic,600,600italic,700,700italic' type='text/css' media='all' />");

                                    }

                                }

                            }

                            // If have data, so set!
                            if (id == 'font-family' && data.indexOf(",") == -1) {

                                // Getting value
                                var value = $("#yp-font-family-data option").filter(function() {
                                    return $(this).text() === data;
                                }).first().attr("value");

                                // Select by value.
                                if (value !== undefined) {

                                    value = value.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                                        return letter.toUpperCase();
                                    });

                                    the_option.val(value);
                                } else {

                                    data = data.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                                        return letter.toUpperCase();
                                    });

                                    the_option.val(data);
                                }

                            } else {

                                // set value.
                                the_option.val(data);

                            }

                            if (id == 'font-family') {
                                $("#yp-font-family,#yp-font-weight").each(function() {
                                    $(this).css("fontFamily", data);
                                });
                            }

                        }

                        // Active none button.
                        id_prt.find(".yp-btn-action.active").trigger("click");

                        // If data is none, auto etc, so active none button.
                        if (data == id_prt.find(".yp-none-btn").text()) {
                            id_prt.find(".yp-none-btn").trigger("click");
                        }

                        // If not have this data in select options, insert this data.
                        if (the_option.val() === null && data != id_prt.find(".yp-none-btn").text() && data !== undefined) {
                            the_option.val(data);
                        }

                        return false;

                        // IF THIS IS A RADIO TAG
                    } else if (the_option.hasClass("yp-radio-content")) {

                        // Fix background size rule.
                        if (id == 'background-size') {
                            if (data == 'auto' || data == '' || data == ' ' || data == 'auto auto') {
                                data = 'auto auto';
                            }
                        }

                        // If disable, active disable button.
                        if (data == 'disable' && id != 'background-parallax') {
                            id_prt.find(".yp-disable-btn").not(".active").trigger("click");
                        } else {
                            radio_value(the_option, id, data); // else Set radio value.
                        }

                        return false;

                        // IF THIS IS COLORPICKER
                    } else if (the_option.hasClass("wqcolorpicker")) {

                        // Remove active
                        $(".yp-nice-c.active,.yp-flat-c.active,.yp-meterial-c.active").removeClass("active");

                        if (id == 'box-shadow-color') {
                            if (data === undefined || data === false || data == 'none' || data == '') {
                                data = the_element.css("color");
                            }
                        }

                        // Convert to rgb and set value.
                        var rgbd;
                        if (isDefined(data)) {
                            if (data.indexOf("#") == -1) {
                                rgbd = get_color(data);
                            }
                        }

                        // browsers return value always in rgb format.
                        the_option.val(rgbd);
                        the_option.iris('color', data);

                        // If rgba
                        var alpha = 100;
                        if(data.indexOf("rgba") != -1){
                            alpha = $.trim(data.replace(/^.*,(.+)\)/,'$1'));
                            if(alpha.indexOf(".") != -1){
                                alpha = alpha.replace("000.","").replace("00.","").replace("0.","").replace(".","");
                                if(alpha.length == 1){
                                    alpha = alpha.toString()+"0";
                                }
                                alpha = alpha.replace(/^0/, "");
                            }
                        }

                        // Update iris alpha.
                        id_prt.find(".cs-alpha-slider").slider('value',alpha); 

                        // Set current color on small area.
                        the_option.parent().find(".wqminicolors-swatch-color").css("backgroundColor", rgbd).css("backgroundImage", "none");

                        // If transparent
                        if (data == 'transparent' || data == '') {
                            id_prt.find(".yp-disable-btn.active").trigger("click");
                            id_prt.find(".yp-none-btn:not(.active)").trigger("click");
                            the_option.parent().find(".wqminicolors-swatch-color").css("backgroundImage", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAADsAQMAAABNHdhXAAAABlBMVEW/v7////+Zw/90AAAAUElEQVRYw+3RIQ4AIAwDwAbD/3+KRPKDGQQQbpUzbS6zF0lLeSffqYr3cXHzzd3PivHmzZs3b968efPmzZs3b968efPmzZs3b968efP+03sBF7TBCROHcrMAAAAASUVORK5CYII=)");
                        } else {
                            id_prt.find(".yp-none-btn.active").trigger("click");
                        }

                        if (id == 'box-shadow-color') {
                            $("#box-shadow-color-group .wqminicolors-swatch-color").css("backgroundColor", data);
                        }

                        return false;

                        // IF THIS IS INPUT OR TEXTAREA
                    } else if (the_option.hasClass("yp-input") || the_option.hasClass("yp-textarea")) {

                        // clean URL() prefix for background image.
                        if (typeof data != 'undefined' && data != 'disable' && id == "background-image" && data != window.location.href) {

                            // If background-image is empty.
                            var a = $(document).find("#iframe").attr("src");
                            var b = data.replace(/"/g, "").replace(/'/g, "").replace(/url\(/g, "").replace(/\)/g, "");
                            if (a == b) {
                                data = '';
                            }

                            the_option.val(data.replace(/"/g, "").replace(/'/g, "").replace(/url\(/g, "").replace(/\)/g, ""));

                            $(".yp_bg_assets").removeClass("active");
                            if (data.indexOf("yellow-pencil") != -1) {
                                $(".yp_bg_assets[data-url='" + data.replace(/"/g, "").replace(/'/g, "").replace(/url\(/g, "").replace(/\)/g, "") + "']").addClass("active");
                            } else {
                                $(".yp-background-image-show").remove();
                                var imgSrc = data.replace(/"/g, "").replace(/'/g, "").replace(/url\(/g, "").replace(/\)/g, "");
                                if (imgSrc.indexOf("//") != -1 && imgSrc != '' && imgSrc.indexOf(".") != -1) {
                                    $("#yp-background-image").after("<img src='" + imgSrc + "' class='yp-background-image-show' />");
                                }
                            }

                        } else {
                            $(".yp-background-image-show").remove();
                        }

                        // If no data, active none button.
                        if (data == 'none') {
                            id_prt.find(".yp-none-btn").not(".active").trigger("click");
                            the_option.val(''); // clean value.
                        } else {
                            id_prt.find(".yp-none-btn.active").trigger("click"); // else disable.
                        }

                        // If no data, active disable button.
                        if (data == 'disable') {
                            id_prt.find(".yp-disable-btn").not(".active").trigger("click");
                            the_option.val('');
                        } else {
                            id_prt.find(".yp-disable-btn.active").trigger("click"); // else disable.
                        }

                        return false;

                    }

                }, 20);

            }

            function is_google_font(font) {

                var status = false;
                $('select#yp-font-family-data option').each(function() {
                    if ($(this).text() == font) {
                        status = true;
                        return true;
                    }
                });

                return status;

            }


            // Desktop | (max-width:980px) etc.
            function get_current_media_query(){

                if(!body.hasClass("yp-responsive-device-mode")){
                    return 'desktop';
                }else{
                    var w = $("#iframe").width();
                    var format = $(".media-control").attr("data-code");
                    return '(' + format + ':' + w + 'px)';
                }
                
            }



            /* ---------------------------------------------------- */
            /* Converting selectors to Array                        */
            /* ---------------------------------------------------- */
            function get_selector_array(selector){

                var selectorArray = [];

                // Clean
                selector = $.trim(selector);

                // Clean multispaces
                selector = selector.replace(/\s\s+/g, ' ');

                // Clean spaces before ">,+,~" and after
                selector = selector.replace(/(\s)?(\>|\,|\+|\~)(\s)?/g, '$2');

                // Convert > to space 
                selector = selector.replace(/\>/g, ' ');

                selector = $.trim(selector);

                // Check if still there have another selector
                if(selector.indexOf(" ") != -1){

                    var selectorSplit = selector.split(" ");

                    // Split with space
                    var v;
                    for(var i = 0; i < selectorSplit.length; i++){

                        // Clean
                        v = $.trim(selectorSplit[i]);

                        // Push
                        selectorArray.push(v);

                    }

                }else{

                    // Push if single.
                    selectorArray.push(selector);

                }

                var selectorArrayNew = [];

                // Add spaces again
                $.each(selectorArray,function(i,v){
                    selectorArrayNew.push(v.replace(/\~/g,' ~ ').replace(/\+/g,' + '));
                });

                return selectorArrayNew;

            }


            /* ---------------------------------------------------- */
            /* Converting Classes to Array                          */
            /* ---------------------------------------------------- */
            function get_classes_array(classes){

                var classesArray = [];

                // Clean
                classes = $.trim(classes);

                // Clean multispaces
                classes = classes.replace(/\s\s+/g, ' ');

                // Check if still there have another class
                if(classes.indexOf(" ") != -1){

                    var classessplit = classes.split(" ");

                    // Split with space
                    var v;
                    for(var i = 0; i < classessplit.length; i++){

                        // Clean
                        v = $.trim(classessplit[i]);

                        // Push
                        classesArray.push(v);

                    }

                }else{

                    // Push if single.
                    classesArray.push(classes);

                }

                return classesArray;

            }


            /* ---------------------------------------------------- */
            /* Find Nice Classes                                    */
            /* ---------------------------------------------------- */
            var filterGoodClasses = [
                'current-menu-item',
                'active',
                'current',
                'post',
                'hentry',
                'widget',
                'sticky',
                'wp-post-image',
                'entry-title',
                'entry-content',
                'entry-meta',
                'comment-author-admin',
                'item',
                'widget-title',
                'widgettitle',
                'next',
                'prev',
                'product',
                'footer',
                'header',
                'sidebar',
                'form-control'
            ];


            /* ---------------------------------------------------- */
            /* Filtering Bad Classes                                */
            /* ---------------------------------------------------- */
            var filterBadClassesBasic = [

                // ETC
                'img-responsive',
                'ls-active',
                'disappear',
                'appear',
                'noSwipe',
                'wow',
                'bootstrap-touchspin-down',
                'open',
                'underlined',
                'resizeme',
                'flippable',
                'section--no',

                // Wordpress Core
                'page([_-])item',
                '([a-zA-Z0-9_-]+)?closed',
                'thread([_-])alt',
                '([a-zA-Z0-9_-s]+)?dismissable([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?([_-])has([_-])?([a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+)?([_-])?has([_-])([a-zA-Z0-9_-]+)',
                'screen([_-])reader([_-])text',
                'post_format-post-format([_-])([a-zA-Z0-9_-]+)?',

                // Divi
                '([a-zA-Z0-9_-]+)?bg_layout([a-zA-Z0-9_-]+)?',

                // Classes from a animate.css
                'infinite',
                'bounce',
                'flash',
                'pulse',
                'rubberBand',
                'shake',
                'headShake',
                'swing',
                'tada',
                'wobble',
                'jello',

                // Bounce
                '([a-zA-Z0-9_-s]+)?bounce([a-zA-Z0-9_-]+)?In([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?bounce([a-zA-Z0-9_-]+)?in([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?bounce([a-zA-Z0-9_-]+)?Out([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?bounce([a-zA-Z0-9_-]+)?out([a-zA-Z0-9_-]+)?',

                // Fade
                '([a-zA-Z0-9_-s]+)?fade([a-zA-Z0-9_-]+)?In([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?fade([a-zA-Z0-9_-]+)?in([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?fade([a-zA-Z0-9_-]+)?Out([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?fade([a-zA-Z0-9_-]+)?out([a-zA-Z0-9_-]+)?',

                // Flip
                '([a-zA-Z0-9_-s]+)?flip([a-zA-Z0-9_-]+)?In([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?flip([a-zA-Z0-9_-]+)?in([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?flip([a-zA-Z0-9_-]+)?Out([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?flip([a-zA-Z0-9_-]+)?out([a-zA-Z0-9_-]+)?',

                // LightSpeed
                '([a-zA-Z0-9_-s]+)?lightSpeed([a-zA-Z0-9_-]+)?In([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?lightSpeed([a-zA-Z0-9_-]+)?in([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?lightSpeed([a-zA-Z0-9_-]+)?Out([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?lightSpeed([a-zA-Z0-9_-]+)?out([a-zA-Z0-9_-]+)?',

                // Rotate
                '([a-zA-Z0-9_-s]+)?rotate([a-zA-Z0-9_-]+)?In([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?rotate([a-zA-Z0-9_-]+)?in([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?rotate([a-zA-Z0-9_-]+)?Out([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?rotate([a-zA-Z0-9_-]+)?out([a-zA-Z0-9_-]+)?',

                // Zoom
                '([a-zA-Z0-9_-s]+)?zoom([a-zA-Z0-9_-]+)?In([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?zoom([a-zA-Z0-9_-]+)?in([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?zoom([a-zA-Z0-9_-]+)?Out([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?zoom([a-zA-Z0-9_-]+)?out([a-zA-Z0-9_-]+)?',

                // Other animation classes
                'hinge',
                'rollIn',
                'rollOut',
                'slideInDown',
                'slideInLeft',
                'slideInRight',
                'slideInUp',
                'slideOutDown',
                'slideOutLeft',
                'slideOutRight',
                'slideOutUp',

                // Post Status classes
                '([a-zA-Z0-9_-]+)?publish([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?draft([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?pending([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?private([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?trash([a-zA-Z0-9_-]+)?',

                // Some functional classes
                '([a-zA-Z0-9_-]+)?viewport([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?padding([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?inherit([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?margin([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?relative([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?transparent([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?border([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?visibility([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?hidden([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?active-slide([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?hide([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?animated([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?align([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?draggable([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?cloned([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?toggled([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?style([0-9_-]+)',
                '([a-zA-Z0-9_-]+)?effect([0-9_-]+)',
                '([a-zA-Z0-9_-]+)?sortable([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?status([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?-spacing-yes',
                '([a-zA-Z0-9_-s]+)?-spacing-no',
                '([a-zA-Z0-9_-]+)?clearfix',
                '([a-zA-Z0-9_-]+)?clear',
                '([a-zA-Z0-9_-]+)?hover([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?parallax([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?ready([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?rounded([a-zA-Z0-9_-]+)?',

                // 5.5.6
                '([a-zA-Z0-9_-]+)?radius([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?loading([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?loaded([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?finished([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?type([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?validates-as([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-s]+)?rand',
                'mrg-btm-([a-zA-Z0-9_-]+)',
                'is([_-])([a-zA-Z0-9_-]+)?',

                // Even & odd
                '([a-zA-Z0-9_-]+)?even([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?odd([a-zA-Z0-9_-]+)?',

                // Browser classes
                '([a-zA-Z0-9_-]+)?opera([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?firefox([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?safari([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?chrome([a-zA-Z0-9_-]+)?',

                // Basic post formats
                'standard',
                'aside',
                'audio',
                'chat',
                'gallery',
                'image',
                'link',
                'quote',
                'status',
                'video',

                // Woocommerce
                '([a-zA-Z0-9_-]+)?product_tag([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?product_cat([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?taxable([a-zA-Z0-9_-]+)?',

                '([a-zA-Z0-9_-]+)?hidden([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?enabled([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?disabled([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)none',
                

                // Visual Composer
                '([a-zA-Z0-9_-]+)?ga-track([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?raw_code([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?raw_html([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?padded([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?bold([a-zA-Z0-9_-]+)?'

            ];


            /* ---------------------------------------------------- */
            /* Filtering Classes                                    */
            /* ---------------------------------------------------- */
            var filterBadClassesPlus = [

                // Don't care post formats
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*standard)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*aside)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*audio)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*chat)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*gallery)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*image)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*link)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*quote)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*status)',
                '((?=.*post)|(?=.*blog)|(?=.*content)|(?=.*entry)|(?=.*page)|(?=.*hentry))(?=.*video)',
                '((?=.*active)|(?=.*current))(?=.*slide)'

            ];
            

            /* ---------------------------------------------------- */
            /* Filtering Classes                                    */
            /* ---------------------------------------------------- */
            var filterSomeClasses = [

                'above',
                'desktop',

                // WordPress Dynamic Classes
                'tag([_-])([a-zA-Z0-9_-]+)?',
                'category([_-])([a-zA-Z0-9_-]+)?',
                'menu([_-])item([_-])type([_-])post([_-])type',
                'menu([_-])item([_-])object([_-])page',
                'menu([_-])item([_-])object([_-])custom',
                'menu([_-])item([_-])type([_-])custom',
                'widget_([a-zA-Z0-9_-]+)',
                'bg-([a-zA-Z0-9_-]+)',

                // Basic classes
                '([a-zA-Z0-9_-]+)?first',
                '([a-zA-Z0-9_-]+)?last',
                '([a-zA-Z0-9_-]+)?text([_-])justify',
                '([a-zA-Z0-9_-]+)?row([a-zA-Z0-9_-]+)?',

                // Modern Columns.
                '([a-zA-Z0-9_-]+)?l([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?m([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?s([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?xs([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?pure([_-])([a-zA-Z0-9_-]+)?([_-])u([_-])[0-9]+([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?col([_-])([a-zA-Z0-9_-]+)?([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?col([_-])([a-zA-Z0-9_-]+)?([_-])offset([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?medium([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?large([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?small([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?medium([_-])([a-zA-Z0-9_-]+)?([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?large([_-])([a-zA-Z0-9_-]+)?([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?small([_-])([a-zA-Z0-9_-]+)?([_-])[0-9]+',

                // Bootstrap Classes
                '([a-zA-Z0-9_-]+)?small([_-])push([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?small([_-])pull([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?medium([_-])push([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?medium([_-])pull([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?large([_-])push([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?large([_-])pull([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?span[0-9]+',
                '([a-zA-Z0-9_-]+)?span([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?col([_-])[0-9]+([_-])[0-9]+',
                '([a-zA-Z0-9_-]+)?col([_-])[0-9]+',

                // Classic Grid Columns
                'column',
                'columns',
                '([a-zA-Z0-9_-]+)one([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?one([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)two([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?two([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)three([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?three([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)four([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?four([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)five([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?five([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)six([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?six([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)seven([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?seven([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)eight([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?eight([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)nine([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?nine([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)ten([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?ten([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)eleven([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?eleven([a-zA-Z0-9_-]+)',
                '([a-zA-Z0-9_-]+)twelve([a-zA-Z0-9_-]+)?|([a-zA-Z0-9_-]+)?twelve([a-zA-Z0-9_-]+)',

                // Status etc
                '([a-zA-Z0-9_-]+)?sticky([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?fixed([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?logged([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?print([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?visible([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?required([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?pull([a-zA-Z0-9_-]+)left',
                '([a-zA-Z0-9_-]+)?pull([a-zA-Z0-9_-]+)right',

                // Dynamic css classes.
                '([a-zA-Z0-9_-]+)?background([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?width([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?height([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?position([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?parent([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?color([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?layout([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?center([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)style([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?animation([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?animate([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?scroll([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?transition([a-zA-Z0-9_-]+)?',

                // unyson
                'unyson-page',
                'end',

                // Pagenavi
                'larger',
                'smaller',

                //Buddypress
                'created_group',
                'mini',
                'activity_update',

                // Not nice
                'left',
                'right',
                'col',

                // force builder
                'forge-block',
                'forge-',

                // theme option classes
                '([a-zA-Z0-9_-]+)?light([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?dark([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)([_-])off',
                '([a-zA-Z0-9_-]+)([_-])on',
                '([a-zA-Z0-9_-]+)default([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)size([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)mobile',
                '([a-zA-Z0-9_-]+)populated',
                '([a-zA-Z0-9_-]+)?hide([a-zA-Z0-9_-]+)?',
                '([a-zA-Z0-9_-]+)?show([a-zA-Z0-9_-]+)?',

                // Woocommerce
                'downloadable',
                'purchasable',
                'instock'

            ];



            /* ---------------------------------------------------- */
            /* Get Best Class Name                                  */
            /* ---------------------------------------------------- */
            /*
                 the most important function in yellow pencil scripts
                  this functions try to find most important class name
                  in classes.

                  If no class, using ID else using tag name.
             */
            function get_best_class($element){

                // Cache
                var element = $($element);

                // Element Classes
                var classes = element.attr("class");

                // Clean Yellow Pencil Classes
                if (classes !== undefined && classes !== null) {
                    classes = class_cleaner(classes);
                }

                // Cache id and tagname.
                var id = element.attr("id");
                var tag = element[0].nodeName.toLowerCase();

                if (tag == 'body' || tag == 'html') {
                    return tag;
                }


                // Default
                var best_classes = '';
                var nummeric_class = '';
                var the_best = '';
                var numberRex = /\d+/;

                // Use tag name with class.
                var ClassNameTag = '';
                if (tag != 'div' && tag !== undefined && tag !== null) {
                    ClassNameTag = tag;
                }

                // If Element has ID, Return ID.
                if (typeof id != 'undefined'){

                    id = $.trim(id);

                    // If has "widget" term in classes, its is a widget element. dont select with the ID.
                    if (classes !== undefined && classes !== null) {

                        // Rex
                        var classRex = /\b([a-zA-Z0-9_-]{1})?widget\b|\b([a-zA-Z0-9_-]{3})?widget\b|\b([a-zA-Z0-9_-]{4})?widget\b|\b([a-zA-Z0-9_-]{5})?widget\b|\b([a-zA-Z0-9_-]{6})?widget\b/;

                        // Set null if has widget id
                        if(classRex.test(classes.toString())){
                            id = '';
                        }

                    }

                    // One plugin prefix that create random base64 id.
                    if (id.substring(0, 4) == "fws_"){
                        id = '';
                    }

                    // Check if ID has number.
                    if(numberRex.test(id)){

                        var sectionsRex = /((?=.*module)|(?=.*slide)|(?=.*section)|(?=.*row)|(?=.*layout)|(?=.*form)|(?=.*pg-)|(?=.*wrapper)|(?=.*container)|(?=.*parallax)|(?=.*block)|(?=.*layers-widget-column)|(?=.*layers-widget-slide)|(?=.*layers-widget-layers-pro-call-to-action)|(?=.*builder-module-))(?=.*\d+)|\bptpb_s(\d+)\b/;

                        // If its has 'slide', 'section' so let to it or else.
                        if(sectionsRex.test(id) === false){
                            id = '';
                        }

                    }

                    // Headway themes dynamic id.
                    if(id.indexOf('wrapper-') != -1 && numberRex.test(id)){
                        if(id.length == 24){
                            id = '';
                        }
                    }

                    // Ex: div#id
                    if (id != '' && $.trim(the_best) == '') {
                        return ClassNameTag + '#' + id;
                    }

                }

                // If has classes.
                if (classes !== undefined && classes !== null) {

                    // Classes to array.
                    var ArrayClasses = get_classes_array(classes);

                    // Foreach classes.
                    // If has normal classes and nunmmeric classes,
                    // Find normal classes and cache to best_classes variable.
                    var v;
                    for(var i = 0; i < ArrayClasses.length; i++){

                        // Value
                        v = ArrayClasses[i];

                        // Has number?
                        if (numberRex.test(v)){

                            // Not has page-item class
                            if(v.indexOf("page-item") == -1){

                                // Added as nummeric classes
                                nummeric_class = v;
                            }

                        } else {

                            // Added as best class
                            best_classes += ' ' + v;

                        }

                    }

                }

                // we want never use some class names. so disabling this classes.
                if(isDefined(best_classes)){

                    // Trim
                    best_classes = $.trim(best_classes);

                    // If length?
                    if(best_classes.length > 1){

                        var v;
                        for(var i = 0; i < filterBadClassesBasic.length; i++){

                            // Value
                            v = filterBadClassesBasic[i];

                            // Processable
                            v = v.replace(/\-/g,'W06lXW').replace(/0W06lXW9/g,'0-9').replace(/\(\w\+\)/g,'\(\\w\+\)').replace(/aW06lXWzAW06lXWZ0-9_W06lXW/g,'a-zA-Z0-9_-').toString();
                            
                            // Regex
                            var re = new RegExp("\\b"+v+"\\b","gi");

                            // Replace
                            best_classes = best_classes.toString().replace(/\-/g,'W06lXW').replace(re, '');

                        }

                    }

                }

                // If Has Best Classes
                if ($.trim(best_classes) != '') {

                    // Make as array.
                    the_best = get_classes_array(best_classes);

                    // Replace significant classes and keep best classes.
                    var significant_classes = $.trim(best_classes.replace(/\-/g,'W06lXW'));
                    
                    // Replace all non useful classes
                    if(isDefined(significant_classes)){

                        // Trim
                        significant_classes = $.trim(significant_classes);

                        // If has
                        if(significant_classes.length > 1){

                            // Each all
                            var v;
                            for(var i = 0; i < filterSomeClasses.length; i++){

                                // Value
                                v = filterSomeClasses[i];

                                // Processable
                                v = v.replace(/\-/g,'W06lXW').replace(/0W06lXW9/g,'0-9').replace(/\(\w\+\)/g,'\(\\w\+\)').replace(/aW06lXWzAW06lXWZ0-9_W06lXW/g,'a-zA-Z0-9_-').toString();

                                // Regex
                                var re = new RegExp("\\b"+v+"\\b","gi");
                                
                                // Replace
                                significant_classes = significant_classes.replace(re, '');

                            }

                        }

                    }


                    // Update
                    significant_classes = $.trim(significant_classes);


                    // Important classes, current-menu-item etc
                    // If has this any classes, keep this more important.
                    var i;
                    var return_the_best = '';
                    for (i = 0; i < the_best.length; i++){

                        if(filterGoodClasses.indexOf(the_best[i].replace(/W06lXW/g,'-')) != -1){

                            // Don't focus to current and active classes on single selector tool.
                            if (mainBody.hasClass("yp-sharp-selector-mode-active")) {
                                if (the_best[i] != 'current' && the_best[i] != 'active') {
                                    return_the_best = the_best[i];
                                }
                            }else{
                                return_the_best = the_best[i];
                            }

                        }

                        // Don't see slider-active classes.
                        if (return_the_best == '' && mainBody.hasClass("yp-sharp-selector-mode-active") === false) {
                            if (the_best[i].indexOf("active") != -1 || the_best[i].indexOf("current") != -1){
                                if(the_best[i].indexOf("slide") == -1){
                                    return_the_best = the_best[i];
                                }
                            }
                        }

                    }

                    // Some nummeric classes is important.
                    if(nummeric_class != ''){

                        // section-1, section-2 etc
                        if(nummeric_class.indexOf("section") != -1){
                            return_the_best = nummeric_class;
                        }

                        // slide-0, slide-1 etc
                        if(nummeric_class.indexOf("slide") != -1){
                            return_the_best = nummeric_class;
                        }

                    }

                    // If no best and has class menu item, use it.
                    if (return_the_best == '' && element.hasClass("menu-item")) {
                        return_the_best = 'menu-item';
                    }

                    // Image selection
                    if (return_the_best == '' && nummeric_class.indexOf("wp-image-") > -1 && tag == 'img'){
                        return_the_best = $.trim(nummeric_class.match(/wp-image-[0-9]+/g).toString());
                    }

                    // Good num classes
                    if (return_the_best == ''){

                        if(nummeric_class.indexOf('section') != -1 || nummeric_class.indexOf("button") != -1 || nummeric_class.indexOf("image") != -1 || nummeric_class.indexOf("fusion-fullwidth") != -1 || nummeric_class.indexOf('vc_custom_') != -1 || (nummeric_class.indexOf('row-') != -1 && the_best.indexOf("row") != -1) || (nummeric_class.indexOf('fl-node-') != -1 && the_best.indexOf("fl-row") != -1)){
                                return_the_best = nummeric_class;                            
                        }

                    }

                    // Some element selecting by tag names.
                    var tagFounded = false;

                    // If there not have any best class.
                    if (return_the_best == '') {

                        // select img by tagname if no id or best class.
                        if (tag == 'img' && typeof id == 'undefined') {
                            tagFounded = true;
                            the_best = tag;
                        }

                        // Use article for this tag.
                        if (tag == 'article' && element.hasClass("comment")) {
                            tagFounded = true;
                            the_best = tag;
                        }

                    }

                    return_the_best  = $.trim(return_the_best.replace(/W06lXW/g, "-"));
                    significant_classes  = $.trim(significant_classes.replace(/W06lXW/g, "-"));

                    if(Array.isArray(the_best)){

                        the_best = $.trim(the_best.toString().replace(/W06lXW/g, "-"));

                        if(the_best.indexOf(",") != -1){
                            the_best = the_best.split(",");
                        }

                        if(the_best.indexOf(" ") != -1){
                            the_best = the_best.split(" ");
                        }
                        
                    }else{
                        
                        the_best = $.trim(the_best.replace(/W06lXW/g, "-"));

                    }

                    if(typeof the_best == 'string'){
                        the_best = get_classes_array(the_best);
                    }


                    // If the best classes is there, return.
                    if (return_the_best != '') {

                        the_best = '.' + return_the_best;

                    // If can't find best classes, use significant classes.
                    } else if (significant_classes != '' && tagFounded === false){

                        // Convert to array.
                        significant_classes = get_classes_array(significant_classes);

                        var matchlessFounded = false;

                        // Find matchless classes for single selector tool.
                        if(mainBody.hasClass("yp-sharp-selector-mode-active")){

                            var matchlessClasses = significant_classes.sort(function(b, a) {
                                return iframeBody.find("."+b).length - iframeBody.find("."+a).length;
                            });

                            if(iframeBody.find("."+matchlessClasses[0]).length == 1){
                                the_best = '.' + matchlessClasses[0];
                                matchlessFounded = true;
                            }else if(matchlessClasses[1] !== undefined){
                                if(iframeBody.find("."+matchlessClasses[0]+"."+matchlessClasses[1]).length == 1){
                                    the_best = '.' + matchlessClasses[0] + '.' + matchlessClasses[1];
                                    matchlessFounded = true;
                                }
                            }

                        }

                        if(matchlessFounded === false){

                            // Find most long classes.
                            var maxlengh = significant_classes.sort(function(a, b) {
                                return b.length - a.length;
                            });
                            
                            // If finded, find classes with this char "-"
                            if (maxlengh[0] != 'undefined'){

                                // Finded.
                                var maxChar = significant_classes.sort(function(a, b) {
                                    return b.indexOf("-") - a.indexOf("-");
                                });

                                // First prefer max class with "-" char.
                                if (maxChar[0] != 'undefined' && maxChar[0].indexOf("-") != -1) {
                                    the_best = '.' + maxChar[0];
                                } else if (maxlengh[0] != 'undefined'){ // else try most long classes.
                                    the_best = '.' + maxlengh[0];
                                }

                            } else {

                                // Get first class.
                                the_best = '.' + significant_classes[0];

                            }

                        }

                    } else if (tagFounded === false){

                        // If has any nummeric class
                        if ($.trim(nummeric_class) != ''){
                            
                            the_best = '.' + nummeric_class;

                        }else{

                            // Get first founded any class.
                            the_best = '.' + the_best[0];

                        }



                    }

                } else { 

                    // If has any nummeric class
                    if ($.trim(nummeric_class) != '') {
                        the_best = '.' + nummeric_class;
                    }

                    // If has an id
                    if ($.trim(id) != '' && $.trim(the_best) == '') {
                        the_best = ClassNameTag + '#' + id;
                    }

                    // If Nothing, Use tag name.
                    if ($.trim(tag) != '' && $.trim(the_best) == '') {
                        the_best = tag;
                    }

                }

                return the_best;

            }


            /* ---------------------------------------------------- */
            /* Get All Current Parents                              */
            /* ---------------------------------------------------- */
            function get_current_selector(){

                var parentsv = body.attr("data-clickable-select");

                if (isDefined(parentsv)) {
                    return parentsv;
                } else {
                    get_parents(null, "default");
                }

            }


            function filter_bad_queries(data){
                return  data.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035\u201C\u201D]/g,'');
            }


            /* ---------------------------------------------------- */
            /* Getting minimized CSS. Cleaning spaces.              */
            /* ---------------------------------------------------- */
            function get_minimized_css(data,media){

                // Clean.
                data = data.replace(/(\r\n|\n|\r)/g, "").replace(/\t/g, '');

                // Don't care rules in comment.
                data = data.replace(/\/\*(.*?)\*\//g, "");

                // clean.
                data = data.replace(/\}\s+\}/g, '}}').replace(/\s+\{/g, '{');

                // clean.
                data = data.replace(/\s+\}/g, '}').replace(/\{\s+/g, '{');
                data = filter_bad_queries(data);

                // Don't care rules in media query
                if(media === true){
                    data = data.replace(/@media(.*?)\}\}/g, '').replace(/@?([a-zA-Z0-9_-]+)?keyframes(.*?)\}\}/g, '').replace(/@font-face(.*?)\}\}/g, '').replace(/@import(.*?)\;/g,'').replace(/@charset(.*?)\;/g,'');
                }

                // data
                return data;

            }


            // Get human selector controller.
            window.humanSelectorArray = [];
            window.humanSelectorArrayEnd = false;

            /* ---------------------------------------------------- */
            /* Get Human Selectors                                  */
            /* ---------------------------------------------------- */
            function get_human_selector(data){

                var allSelectors,i;

                // Don't search it always
                if(window.humanSelectorArray.length === 0){

                    // Getting minimized data.
                    data = get_minimized_css(data,true);

                    // if no data, stop.
                    if(data == ''){
                        return false;
                    }

                    data = data.toString().replace(/\}\,/g, "}");

                    // Getting All CSS Selectors.
                    allSelectors = array_cleaner(data.replace(/\{(.*?)\}/g, '|BREAK|').split("|BREAK|"));

                }

                // Vars
                var foundedSelectors = [];
                var selector;

                // get cached selector Array
                if(window.humanSelectorArrayEnd){
                    allSelectors = window.humanSelectorArray;
                }

                if(isUndefined(allSelectors)){
                    return false;
                }

                // Each All Selectors
                for (i = 0; i < allSelectors.length; i++){

                    // Get Selector.
                    selector = space_cleaner(allSelectors[i]);
                    selector = space_cleaner(selector.replace("{",'').replace("}",''));

                    // YP not like so advanced selectors.
                    if(selector.indexOf(",") != -1 || selector.indexOf(":") != -1 || selector.indexOf("*") != -1 || selector.indexOf("/") != -1){
                        continue;
                    }

                    // Not basic html tag selectors.
                    if(selector.indexOf("#") == -1 && selector.indexOf(".") == -1){
                        continue;
                    }

                    // min two
                    if(get_selector_array(selector).length < 2){
                        continue;
                    }

                    // Check if selector valid
                    if(iframeBody.find(selector).length > 0){

                        // Cache other selectors.
                        if(window.humanSelectorArrayEnd === false){
                            window.humanSelectorArray.push(selector);
                        }

                        // Founded Selector
                        if(iframeBody.find(selector).hasClass("yp-selected")){
                            foundedSelectors.push(selector);
                        }

                    }

                }

                // Don't read again css files. cache all human CSS selectors.
                window.humanSelectorArrayEnd = true;

                // New selectors
                var foundedNewSelectors = [];

                // Each all founded selectors.
                // Don't use if has non useful classes as format-link etc.
                for(i = 0; i < foundedSelectors.length; i++){

                    var selectorBefore = foundedSelectors[i].replace(/\-/g,'W06lXW');
                    var passedClasses = true;

                    // Check if has an useful class
                    var v;
                    for(var i = 0; i < filterBadClassesBasic.length; i++){

                        // Get value
                        v = filterBadClassesBasic[i];

                        // Value
                        v = v.replace(/\-/g,'W06lXW').replace(/0W06lXW9/g,'0-9').replace(/\(\w\+\)/g,'\(\\w\+\)').replace(/aW06lXWzAW06lXWZ0-9_W06lXW/g,'a-zA-Z0-9_-').toString();

                        // Regex
                        var re = new RegExp("\\b"+v+"\\b","gi");

                        // Founded an non useful class.
                        if(selectorBefore.match(re) !== null){
                            passedClasses = false;
                        }

                    }

                    // Check if has bad class
                    var v;
                    for(var i = 0; i < filterBadClassesPlus.length; i++){

                        // Get value
                        v = filterBadClassesPlus[i];

                        // Value
                        v = v.replace(/\-/g,'W06lXW').replace(/0W06lXW9/g,'0-9').replace(/\(\w\+\)/g,'\(\\w\+\)').replace(/aW06lXWzAW06lXWZ0-9_W06lXW/g,'a-zA-Z0-9_-').toString();

                        // Regex
                        var re = new RegExp("\\b"+v+"\\b","gi");

                        // Founded an bad class.
                        if(selectorBefore.match(re) !== null){
                            passedClasses = false;
                        }

                    }

                    // Successful.
                    if(passedClasses === true){
                        foundedNewSelectors.push(foundedSelectors[i]);
                    }

                }

                return foundedNewSelectors;

            }



            /* ---------------------------------------------------- */
            /* Get All Parents                                      */
            /* ---------------------------------------------------- */
            function get_parents(element, status){

                // If parent already has.
                var parentsv = body.attr("data-clickable-select");

                // If status default, return current data.
                if (status == 'default' || status == 'defaultS') {
                    if (isDefined(parentsv)) {
                        return parentsv;
                    }
                }

                if(element === null){
                    element = get_selected_element();
                }

                // Be sure this item is valid.
                if (element[0] === undefined || element[0] === false || element[0] === null) {
                    return false;
                }

                // Is sharp?
                if(mainBody.hasClass("yp-sharp-selector-mode-active")){
                    status = 'sharp';
                }

                // Tag info
                var tagE = element[0].tagName;

                // ?
                if(isUndefined(tagE)){
                    return false;
                }

                // If body, return.
                if (tagE == 'BODY') {
                    return 'body';
                }

                // Not possible.
                if (tagE == 'HTML') {
                    return false;
                }

                // Getting item parents.
                var parents = element.parents();

                // Empy variable.
                var selector = '';
                var lastSelector = '';

                // Foreach all loops.
                for (var i = parents.length - 1; i >= 0; i--) {

                    // If first Selector Item
                    if (i == parents.length - 1) {

                        selector += get_best_class(parents[i]);

                    } else { // If not.

                        // Get Selector name.
                        var thisSelector = get_best_class(parents[i]);

                        // Check if this Class.
                        // Reset past selector names if current selector already one in document.
                        if (thisSelector.indexOf(".") != -1 && iframe.find(thisSelector).length == 1){

                            if (status != 'sharp') {
                                selector = thisSelector + window.separator; // Reset
                            }

                            if (status == 'sharp') {
                                if (single_selector(selector).indexOf("nth-child") == -1) {
                                    selector = thisSelector + window.separator; // Reset
                                }
                            }

                        } else {

                            selector += thisSelector + window.separator; // add new

                        }

                    }

                }


                // Clean selector.
                selector = space_cleaner(selector);


                // Adding Last element to selector.
                // and check custom last element part for input tags.
                if (tagE == 'INPUT'){ // if input,use tag name with TYPE.

                    var type;

                    if (status != 'sharp') {

                        type = element.attr("type");
                        lastSelector = window.separator + 'input[type=' + type + ']';

                    }else{

                        var sharpLast = get_best_class(element);

                        if(sharpLast.indexOf("input#") != -1){
                            sharpLast = sharpLast.replace("input#","#");
                        }

                        type = element.attr("type");

                        lastSelector = window.separator + 'input[type=' + type + ']' + sharpLast;

                    }


                }else{ // else find the best class.

                    lastSelector = window.separator + get_best_class(element);

                }

                // Selectors ready!
                selector += lastSelector;

                // Fix google map contents
                if(selector.indexOf(".gm-style") != -1){
                    selector = '.gm-style';
                }

                // Selector clean.
                selector = selector.replace("htmlbody", "body");

                // Return if is single selector
                if (status == 'sharp') {
                    return single_selector(selector);
                }


                if (selector.indexOf("#") >= 0 && selector.indexOf("yp-") == -1) {
                    var before = selector.split("#")[0];
                    if (get_selector_array(before).length === 0) {
                        before = before;
                    } else {
                        before = get_selector_array(before)[get_selector_array(before).length - 1];
                    }
                    selector = selector.split("#");
                    selector = selector[(selector.length - 1)];
                    if (before.length < 4) {
                        selector = before + "#" + selector;
                    } else {
                        selector = "#" + selector;
                    }
                }


                // NEW
                var array = get_selector_array(selector);

                var q = 0;
                for (q = 0; q < array.length - 2; q++) {

                    if (element.parents(array[q]).length == 1) {
                        delete array[q + 1];
                    }

                }

                var selectorNew = $.trim(array.join(window.separator)).replace(/  /g, ' ');
                if (iframe.find(selector).length == iframe.find(selectorNew).length) {
                        selector = selectorNew;
                }

                
                // Check all others elements has same nodename or not.
                if(tagE == 'H1' || tagE == 'H2' || tagE == 'H3' || tagE == 'H4' || tagE == 'H5' || tagE == 'H6' || tagE == 'P' || tagE == 'SPAN' || tagE == 'IMG' || tagE == 'STRONG' || tagE == 'A' || tagE == 'LI' || tagE == 'UL'){

                    var foundedTags = [];
                    iframeBody.find(selector).each(function(){
                        if(foundedTags.indexOf($(this)[0].nodeName) == -1){
                            foundedTags.push($(this)[0].nodeName);
                        }
                    });

                    if(foundedTags.length > 1){
                        selector = selector.split(lastSelector)[0] + window.separator + tagE.toLowerCase();
                    }

                }


                // Use > If has same selectored element in selected element
                if (status == 'default') {

                    var selectedInSelected = iframeBody.find(selector+window.separator+lastSelector).length;

                    // USE : ">"
                    if(selectedInSelected > 0){

                        var untilLast = get_parents(element.parent(),"defaultS");

                        selector = untilLast + " > " + lastSelector;

                        selector = $.trim(selector);

                    }

                }

                // Getting selectors by CSS files.
                if(get_selector_array(selector).length > 1){

                    // Get human selectors
                    var humanSelectors = get_human_selector(window.humanStyleData);

                    // Get valid human selectors
                    var goodHumanSelectors = [];

                    // Check is valid
                    if(humanSelectors.length > 0){

                        // Each founded selectors
                        $.each(humanSelectors,function(qx){

                            // Find the best in human selectors
                            if(iframe.find(humanSelectors[qx]).length == iframe.find(selector).length){

                                // Push
                                goodHumanSelectors.push(humanSelectors[qx]);

                            }

                        });

                        // There is good selectors?
                        if(goodHumanSelectors.length > 0){
                            
                            // Find max long selector
                            var maxSelector = goodHumanSelectors.sort(function(a, b) {
                                return b.length - a.length;
                            });

                            // Be sure more long than 10 char
                            if(maxSelector[0].length > 10){

                                // Update
                                selector = maxSelector[0];

                            }

                        }

                    }

                }


                // Keep selectors smart and short!
                if(get_selector_array(selector).length > 5){

                    // short Selector Ready
                    var shortSelectorReady = false;

                    // Find a founded elements
                    var foundedElements = iframe.find(selector).length;

                    // Get array from selector.
                    var shortSelector = get_selector_array(selector);

                    // Each array items
                    $.each(shortSelector,function(){

                        if(shortSelectorReady === false){

                            // Shift
                            shortSelector.shift();

                            // make it short
                            var shortSelectorString = shortSelector.toString().replace(/\,/g," ");

                            // Search
                            var foundedElShort =  iframe.find(shortSelectorString).length;

                            // Shift until make it minimum 5 item
                            if(shortSelector.length <= 5 && foundedElements == foundedElShort){
                                shortSelectorReady = true;
                                selector = shortSelectorString;
                            }

                        }

                    });

                }
                
                // Return result.
                return space_cleaner(selector);

            }




            // A simple trim function
            function left_trim(str, chr) {
                var rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
                return str.replace(rgxtrim, '');
            }


            /* ---------------------------------------------------- */
            /* Draw Tooltip and borders.                            */
            /* ---------------------------------------------------- */
            function draw_box(element, classes) {

                var element_p;

                if (typeof $(element) === 'undefined') {
                    element_p = $(element);
                } else {
                    element_p = iframe.find(element);
                }

                // Be sure this element have.
                if (element_p.length > 0) {

                    var marginTop = element_p.css("marginTop");
                    var marginBottom = element_p.css("marginBottom");
                    var marginLeft = element_p.css("marginLeft");
                    var marginRight = element_p.css("marginRight");

                    var paddingTop = element_p.css("paddingTop");
                    var paddingBottom = element_p.css("paddingBottom");
                    var paddingLeft = element_p.css("paddingLeft");
                    var paddingRight = element_p.css("paddingRight");

                    //Dynamic boxes variables
                    var element_offset = element_p.offset();
                    var topBoxes = element_offset.top;
                    var leftBoxes = element_offset.left;
                    if (leftBoxes < 0) {
                        leftBoxes = 0;
                    }
                    var widthBoxes = element_p.outerWidth(false);
                    var heightBoxes = element_p.outerHeight(false);

                    var bottomBoxes = topBoxes + heightBoxes;

                    var rightExtra = 1;
                    var rightS = 1;

                    if (is_content_selected()) {
                        rightExtra = 2;
                        rightS = 2;
                    }

                    var rightBoxes = leftBoxes + widthBoxes - rightExtra;

                    var windowWidth = $(window).width();

                    // If right border left is more then screen
                    if (rightBoxes > (windowWidth - window.scroll_width - rightS)) {
                        rightBoxes = windowWidth - window.scroll_width - rightS;
                    }

                    // If bottom border left is more then screen
                    if ((leftBoxes + widthBoxes) > windowWidth) {
                        widthBoxes = windowWidth - leftBoxes - 1;
                    }


                    // Append border elements
                    if (heightBoxes > 1 && widthBoxes > 1) {

                        if (iframe.find("." + classes + "-top").length === 0) {

                            // Border
                            var appendBox = "<div class='" + classes + "-top'></div><div class='" + classes + "-bottom'></div><div class='" + classes + "-left'></div><div class='" + classes + "-right'></div>";

                            // margin
                            appendBox += "<div class='" + classes + "-margin-top'></div><div class='" + classes + "-margin-bottom'></div><div class='" + classes + "-margin-left'></div><div class='" + classes + "-margin-right'></div>";

                            // padding
                            appendBox += "<div class='" + classes + "-padding-top'></div><div class='" + classes + "-padding-bottom'></div><div class='" + classes + "-padding-left'></div><div class='" + classes + "-padding-right'></div>";

                            // Append
                            iframeBody.append(appendBox);

                        }

                        // Variables for inline CSS
                        var topTop = parseFloat(topBoxes) - parseFloat(marginTop);
                        var leftLeft = parseFloat(leftBoxes) - parseFloat(marginLeft);
                        var widthWidth = parseFloat(widthBoxes) + parseFloat(marginRight) + parseFloat(marginLeft);
                        var widthWidthp = parseFloat(widthBoxes / 2);
                        var heightHeight = heightBoxes / 2;
                        var bottomBottom = bottomBoxes - parseFloat(paddingBottom);
                        var rightRight = rightBoxes - parseFloat(paddingRight);

                        // Box Border
                        var style = "." + classes + "-top{top:"+topBoxes+"px !important;left:"+leftBoxes+"px !important;width:"+widthBoxes+"px !important;}";
                        style += "." + classes + "-bottom{top:"+bottomBoxes+"px !important;left:"+leftBoxes+"px !important;width:"+widthBoxes+"px !important;}";
                        style += "." + classes + "-left{top:"+topBoxes+"px !important;left:"+leftBoxes+"px !important;height:"+heightBoxes+"px !important;}";
                        style += "." + classes + "-right{top:"+topBoxes+"px !important;left:"+rightBoxes+"px !important;height:"+heightBoxes+"px !important;}";

                        // Margin
                        style += "." + classes + "-margin-top{top:"+topTop+"px !important;left:"+leftLeft+"px !important;width:"+widthWidth+"px !important;height:"+parseFloat(marginTop)+"px !important;}";
                        style += "." + classes + "-margin-bottom{top:"+bottomBoxes+"px !important;left:"+leftLeft+"px !important;width:"+widthWidth+"px !important;height:"+parseFloat(marginBottom)+"px !important;}";
                        style += "." + classes + "-margin-left{top:"+topBoxes+"px !important;left:"+leftLeft+"px !important;width:"+parseFloat(marginLeft)+"px !important;height:"+heightBoxes+"px !important;}";
                        style += "." + classes + "-margin-right{top:"+topBoxes+"px !important;left:"+rightBoxes+2+"px !important;width:"+parseFloat(marginRight)+"px !important;height:"+heightBoxes+"px !important;}";

                        // Padding
                        style += "." + classes + "-padding-top{top:"+parseFloat(topBoxes)+"px !important;left:"+parseFloat(leftBoxes)+"px !important;width:"+widthWidthp+"px !important;height:"+parseFloat(paddingTop)+"px !important;}";
                        style += "." + classes + "-padding-bottom{top:"+bottomBottom+"px !important;left:"+parseFloat(leftBoxes)+"px !important;width:"+widthWidthp+"px !important;height:"+parseFloat(paddingBottom)+"px !important;}";
                        style += "." + classes + "-padding-left{top:"+topBoxes+"px !important;left:"+parseFloat(leftBoxes)+"px !important;width:"+parseFloat(paddingLeft)+"px !important;height:"+heightHeight+"px !important;}";
                        style += "." + classes + "-padding-right{top:"+topBoxes+"px !important;left:"+rightRight+"px !important;width:"+parseFloat(paddingRight)+"px !important;height:"+heightHeight+"px !important;}";


                        // Style#yp-draw-box
                        var drawBoxStyle = iframeBody.find("#yp-draw-box");

                        // Append
                        if(drawBoxStyle.length > 0){
                            drawBoxStyle.html(style);
                        }else{
                            iframeBody.append("<style id='yp-draw-box'>"+style+"</style>");
                        }

                        if(is_resizing() == false && is_dragging() == false){
                            iframe.find(".yp-selected-handle").css("left", leftBoxes).css("top", topBoxes);
                        }

                    }

                }

            }



            // Processing media Query
            function process_media_query(condition){

                var die = false;

                // Not processable
                var conRex = /\bhandheld\b|\baural\b|\bbraille\b|\bembossed\b|\bprojection\b|\btty\b|\btv\b|\bprint\b|\b3d-glasses\b/;

                if(conRex.test(condition)){
                    return null;
                }

                // not and , not acceptable
                var conRex2 = /,|\bnot\b/;
                if(conRex2.test(condition)){
                    return false;
                }

                // For replace em & and rem
                var fontSizeRotio = parseFloat(iframe.find("html").css("fontSize"));

                // replacing rem & em to PX
                condition = condition.replace(/[0-9. ]+(rem|em)/g, function(match, contents, offset, s){
                        return parseFloat(match)*fontSizeRotio+"px";
                    }
                );

                // Get all queries
                var queries = condition.match(/\((.*?)\)/g);

                var goValue = [];
                var minmaxRex = /max-width|min-width/;

                // loop queries
                $.each(queries, function(index,query){

                    // Just max and min width
                    if(minmaxRex.test(query) == false){
                        die = true;
                        return false;
                    }
                    
                    // Cleaning
                    query = query.replace(/\(|\)|:|px|\s+/g,'');

                    // max min widths
                    query = query.replace(/min-width/g,'>');
                    query = query.replace(/max-width/g,'<');

                    goValue.push(query);

                });

                // Return
                if(die == false){
                    return goValue;
                }

            }


            // Clean selector with regex.
            function selector_regex(selector){
                return selector
                .replace(/\./g, "\\.")  // [
                .replace(/\[/g, "\\[")  // [
                .replace(/\]/g, "\\]")  // ]
                .replace(/\(/g, "\\(")  // (
                .replace(/\)/g, "\\)")  // )
                .replace(/\^/g, "\\^")  // ^
                .replace(/\$/g, "\\$")  // $
                .replace(/\*/g, "\\*")  // *
                .replace(/\:/g, "\\:")  // :
                .replace(/\+/g, "\\+"); // +
            }



            function get_media_queries(css){

                var data = window.humanStyleData;

                var mediaSelectors;
                var mediaContent;
                var mediaList = [];

                // Getting minimized data.
                data = get_minimized_css(data,false);

                // if no data, stop.
                if(data == ''){
                    return false;
                }

                data = data.toString().replace(/\}\,/g, "}");

                // Getting All media Queries.
                var allMedia = array_cleaner(data.match(/@media(.*?){(.*?)}}/g));

                // Each media queries
                $.each(allMedia,function(index,value){

                    // Current media CSS
                    mediaContent = value.match(/\{(.*?)\}}/g).join("").replace(/\}\}$/g,'}');

                    // GEtting all selectors inside media
                    mediaSelectors = array_cleaner(mediaContent.replace(/\{(.*?)\}/g, '|BREAK|').split("|BREAK|"));

                    // Each all selectors
                    $.each(mediaSelectors,function(index,selector){

                        // End after 50
                        if(index > 50){
                            return false;
                        }

                        // Check if there any selector matches the target element
                        if(selector != '' && selector.indexOf("*") == -1  && selector.indexOf(":") == -1 && selector.indexOf("@") == -1 && selector.indexOf("}") == -1 && selector.indexOf("{") == -1){

                            if(iframe.find(get_foundable_query(selector,true,true,true)).hasClass("yp-selected")){

                                var ruleAll = mediaContent.match(new RegExp(selector_regex(selector) + "(\s+)?\{(.*?)\}",'gi')).toString();

                                var rules = array_cleaner(ruleAll.match(/\{(.*?)\}/g).toString().replace(/:(.*?)(;|})(\s+)?/g,'|BREAK|').replace(/(\{|\}|\,)/g,'').split("|BREAK|"));

                                // If the current media has any selector
                                // for target element, so process the media query.
                                if(rules.indexOf(css.replace(/(min-|max-)/g,'')) != -1){

                                    mediaList.push( value.match(/\@media(.*?){/g).toString().replace("{",'') );

                                }

                            }

                        }

                    });

                });

        
                // Each all media list
                var mediaQueries = [];
                var foundedMedia = false;
                var processed,queryX;
                $.each(array_cleaner(mediaList),function(index,query){

                    // Processed
                    processed = process_media_query(query);

                    // Adds mediaQueries
                    mediaQueries.push( processed );

                    // Basic for check with matchMedia
                    queryX = space_cleaner(query.replace("@media",""));

                    // add if it is active
                    if(window.matchMedia(queryX).matches && processed != false && processed != null){
                        foundedMedia = query;
                    }

                });

                if(foundedMedia != false){
                    return foundedMedia;
                }

                return creating_auto_media_query(mediaQueries);

            }


            // Creating Auto Media Queries
            function creating_auto_media_query(arrMedia){

                var condition = false;
                var closestLow;

                // Current Width
                var currentWidth = $(window).width();

                var upArr = [];
                var downArr = [];

                // ARR Media
                $.each(arrMedia,function(index,value){
                    
                    if(value != null){
                        value = value.toString();
                        if(value.indexOf("<") != -1){
                            downArr.push(value.replace(/\</g,''));
                        }else if(value.indexOf(">") != -1){
                            upArr.push(value.replace(/\>/g,''));
                        }
                    }

                });

                // High to low
                upArr = upArr.sort(function(a, b){return b-a});
                downArr = downArr.sort(function(a, b){return b-a});

                $.each(downArr, function(){
                  if (this <= currentWidth && (closestLow == null || (currentWidth - this) < (currentWidth - closestLow))) {
                    closestLow = this;
                  }
                });

                // if min-width high and max-width low than current width
                if(downArr.length > 0 && upArr.length > 0){
                    if(upArr[0] > currentWidth && downArr[0] < currentWidth){
                        condition = '@media (min-width:'+downArr[0]+'px) and (max-width:'+upArr[0]+'px)';
                    }
                }

                // if min-width and max-width high than current width
                if(downArr.length > 0 && upArr.length > 0){
                    if(upArr[0] > currentWidth && downArr[0] > currentWidth){

                        if(closestLow < currentWidth){
                            condition = '@media (max-width:'+upArr[0]+'px) and (min-width:'+closestLow+'px)';
                        }else{
                            condition = '@media (max-width:'+upArr[0]+'px)';
                        }

                    }
                }

                // if min-width and max-width high than current width
                if(downArr.length == 0 && upArr.length > 0){
                    if(upArr[0] > currentWidth){
                        condition = '@media (max-width:'+upArr[0]+'px)';
                    }
                }

                // if min-width and max-width low than current width
                if(downArr.length > 0 && upArr.length > 0){
                    if(upArr[0] < currentWidth && downArr[0] < currentWidth){
                        condition = '@media (min-width:'+downArr[0]+'px)';
                    }
                }

                // if min-width and max-width low than current width
                if(downArr.length > 0 && upArr.length == 0){
                    if(downArr[0] < currentWidth){
                        condition = '@media (min-width:'+downArr[0]+'px)';
                    }
                }

                // if min-width and max-width low than current width
                if(downArr.length > 1 && upArr.length == 0){
                    if(downArr[0] > currentWidth && closestLow < currentWidth){
                        condition = '@media (max-width:'+downArr[0]+'px) and (min-width:'+closestLow+'px)';
                    }
                }

                return condition;

            }



            // From Alexandre Gomes Blog
            function get_scroll_bar_width() {

                // no need on responsive mode.
                if (mainBody.hasClass("yp-responsive-device-mode")) {
                    return 0;
                }

                // If no scrollbar, return zero.
                if (iframe.height() <= $(window).height() && mainBody.hasClass("yp-metric-disable")) {
                    return 0;
                }

                var inner = document.createElement('p');
                inner.style.width = "100%";
                inner.style.height = "200px";

                var outer = document.createElement('div');
                outer.style.position = "absolute";
                outer.style.top = "0px";
                outer.style.left = "0px";
                outer.style.visibility = "hidden";
                outer.style.width = "200px";
                outer.style.height = "150px";
                outer.style.overflow = "hidden";
                outer.appendChild(inner);

                document.body.appendChild(outer);
                var w1 = inner.offsetWidth;
                outer.style.overflow = 'scroll';
                var w2 = inner.offsetWidth;
                if (w1 == w2) w2 = outer.clientWidth;

                document.body.removeChild(outer);

                return (w1 - w2);

            }



            // Remove multiple selected element
            iframe.on("click", '.yp-selected-others', function() {

                var el = $(this);

                var currentSelector = get_current_selector();

                if(mainBody.hasClass("yp-control-key-down") && currentSelector.split(",").length > 0){

                    // Remove YP Classes
                    el.removeClass("yp-selected-others yp-recent-hover-element");

                    // Get Selector
                    var selector = get_parents(el,'sharp');

                    currentSelector = currentSelector.replace(new RegExp(","+selector_regex(selector),"g"),"");

                    var firstEl = get_selected_element();

                    set_selector(currentSelector,firstEl);

                    // return false to block other click function
                    return false;

                }

            });



            /* ---------------------------------------------------- */
            /* Draw Tooltip and borders.                            */
            /* ---------------------------------------------------- */
            function draw_other_box(element, classes, $i) {

                var element_p = $(element);

                var elementClasses = element_p.attr("class");

                if (element_p === null) {
                    return false;
                }

                if (element_p[0].nodeName == "HTML" || element_p[0].nodeName == "BODY") {
                    return false;
                }

                if (element_p.length === 0) {
                    return false;
                }

                // Be sure this is visible on screen
                if (element_p.css("display") == 'none' || element_p.css("visibility") == 'hidden' || element_p.css("opacity") == '0') {
                    return false;
                }

                // Not show if p tag and is empty.
                if (element_p.html() == '&nbsp;' && element_p.prop("tagName") == 'P') {
                    return false;
                }

                // Stop.
                if(mainBody.hasClass("yp-has-transform")){
                    return false;
                }

                // not draw new box and delete last.
                if(isDefined(elementClasses)){

                    elementClasses = elementClasses.replace(/yp-selected-others/g,'');

                    var pluginelRex = /yp-selected|yp-tooltip-small|yp-edit-/;

                    if(pluginelRex.test(elementClasses) || element_p.hasClass("yp-selected-others-box")){
                        if(iframe.find("." + classes + "-" + $i + "-box").length > 0){
                            iframe.find("." + classes + "-" + $i + "-box").remove();
                        }

                        return false;

                    }

                }
                    
                // Stop.
                if (check_with_parents(element_p, "transform", "none", "!=") === true) {
                    element_p.addClass("yp-selected-has-transform");
                    return false;
                }

                // Stop.
                if (check_with_parents(element_p, "display", "none", "==") === true || check_with_parents(element_p, "opacity", "0", "==") === true || check_with_parents(element_p, "visibility", "hidden", "==") === true) {
                    return false;
                }

                //Dynamic boxes variables
                var element_offset = element_p.offset();
                var topBoxes = element_offset.top;
                var leftBoxes = element_offset.left;
                var widthBoxes = element_p.outerWidth(false);
                var heightBoxes = element_p.outerHeight(false);

                if (heightBoxes > 1 && widthBoxes > 1) {

                    // Append Dynamic Box
                    if (iframe.find("." + classes + "-" + $i + "-box").length === 0) {
                        iframeBody.append("<div class='" + classes + "-box " + classes + "-" + $i + "-box' style='top:"+parseFloat(topBoxes)+"px !important;left:"+parseFloat(leftBoxes)+"px !important;width:"+parseFloat(widthBoxes)+"px !important;height:"+parseFloat(heightBoxes)+"px !important;'></div>");
                    }

                }

            }



            /* ---------------------------------------------------- */
            /* Visible Height in scroll.                            */
            /* ---------------------------------------------------- */
            function get_visible_height(t) {
                var top = t.offset().top;
                var scrollTop = iframe.scrollTop();
                var height = t.outerHeight();

                if (top < scrollTop) {
                    return height - (scrollTop - top);
                } else {
                    return height;
                }

            }



            /* ---------------------------------------------------- */
            /* Draw Tooltip and borders.                            */
            /* ---------------------------------------------------- */
            function draw_tooltip(){

                var tooltip = iframe.find(".yp-selected-tooltip");
                var tooltipMenu = iframe.find(".yp-edit-tooltip");

                if (tooltip.length <= 0) {
                    return false;
                }

                // Hide until set position to tooltip if element still not selected.
                if (!is_content_selected()) {
                    tooltip.css("visibility", "hidden");
                    tooltipMenu.css("visibility", "hidden");
                }

                var element = get_selected_element();

                // If not visible stop.
                if (check_with_parents(element, "display", "none", "==") === true || check_with_parents(element, "opacity", "0", "==") === true || check_with_parents(element, "visibility", "hidden", "==") === true) {
                    return false;
                }

                var element_offset = element.offset();

                if (isUndefined(element_offset)) {
                    return false;
                }

                tooltip.removeClass("yp-tooltip-bottom-outside");

                var topElement = parseFloat(element_offset.top) - 24;

                var leftElement = parseFloat(element_offset.left);

                tooltip.css("top", topElement).css("left", leftElement);
                tooltipMenu.css("top", topElement).css("left", leftElement);

                // If outside of bottom, show.
                if (topElement >= ($(window).height() + iframe.scrollTop() - 24)) {

                    if (!tooltip.hasClass("yp-fixed-tooltip")) {
                        tooltip.addClass("yp-fixed-tooltip");
                    }

                    // Update
                    topElement = ($(window).height() + iframe.scrollTop() - 24);

                    tooltip.addClass("yp-fixed-tooltip-bottom");

                } else {

                    if (tooltip.hasClass("yp-fixed-tooltip")) {
                        tooltip.removeClass("yp-fixed-tooltip");
                    }

                    tooltip.removeClass("yp-fixed-tooltip-bottom");

                }

                // If out of top, show.
                var tooltipRatio;
                if (topElement < 2 || topElement < (iframe.scrollTop() + 2)) {

                    var bottomBorder = iframe.find(".yp-selected-boxed-bottom");

                    topElement = parseFloat(bottomBorder.css("top")) - parseFloat(get_visible_height(element));

                    tooltip.css("top", topElement);
                    tooltipMenu.css("top", topElement);

                    tooltip.addClass("yp-fixed-tooltip");

                    tooltipRatio = (tooltip.outerHeight() * 100 / get_visible_height(element));

                    if (tooltipRatio > 10) {
                        tooltip.addClass("yp-tooltip-bottom-outside");
                        topElement = parseFloat(bottomBorder.css("top")) - parseFloat(tooltip.outerHeight()) + tooltip.outerHeight();

                        tooltip.css("top", topElement);
                        tooltipMenu.css("top", topElement);

                    } else {
                        tooltip.removeClass("yp-tooltip-bottom-outside");
                    }

                } else {
                    tooltip.removeClass("yp-fixed-tooltip");
                }

                if (tooltipRatio < 11) {
                    tooltip.removeClass("yp-tooltip-bottom-outside");
                }

                if (tooltip.hasClass("yp-fixed-tooltip") && tooltip.hasClass("yp-tooltip-bottom-outside") === false) {
                    tooltipMenu.addClass("yp-fixed-edit-menu");
                } else {
                    tooltipMenu.removeClass("yp-fixed-edit-menu");
                }

                if (tooltip.hasClass("yp-tooltip-bottom-outside")) {
                    tooltipMenu.addClass("yp-bottom-outside-edit-menu");
                } else {
                    tooltipMenu.removeClass("yp-bottom-outside-edit-menu");
                }

                if (tooltip.hasClass("yp-fixed-tooltip-bottom")) {
                    tooltipMenu.addClass("yp-fixed-bottom-edit-menu");
                } else {
                    tooltipMenu.removeClass("yp-fixed-bottom-edit-menu");
                }


                tooltip.css({"visibility":"visible","pointer-events":"none"});
                tooltipMenu.css({"visibility":"visible","pointer-events":"none"});

                    // If high
                    if ($("#iframe").width() - (tooltip.width() + tooltip.offset().left + 80) <= 0) {

                        // simple tooltip.
                        tooltip.addClass("yp-small-tooltip");

                    } else { // If not high

                        // if already simple tooltip
                        if (tooltip.hasClass("yp-small-tooltip")) {

                            // return to default.
                            tooltip.removeClass("yp-small-tooltip");

                            // check again if need to be simple
                            if ($("#iframe").width() - (tooltip.width() + tooltip.offset().left + 80) <= 0) {

                                // make it simple.
                                tooltip.addClass("yp-small-tooltip");

                            }

                        }

                    }

                tooltip.css({"pointer-events":"auto"});
                tooltipMenu.css({"pointer-events":"auto"});

            }



            // if mouseup on iframe, trigger for document.
            iframe.on("mouseup", iframe, function() {

                $(document).trigger("mouseup");

            });



            function set_draggable(element) {

                // Add drag support
                if (iframeBody.find(".yp-selected").length > 0) {

                    element.draggable({

                        containment: iframeBody,
                        delay: 100,
                        start: function(e, ui) {

                            window.elDragWidth = element.outerWidth();
                            window.elDragHeight = element.outerHeight();

                            if (mainBody.hasClass("yp-css-editor-active")) {
                                $(".css-editor-btn").trigger("click");
                            }

                            if (!is_content_selected()) {
                                return false;
                            }

                            // Close contextmenu
                            if (iframe.find(".context-menu-active").length > 0) {
                                get_selected_element().contextMenu("hide");
                            }

                            get_selected_element().removeClass("yp_onscreen yp_hover yp_click yp_focus");

                            // Get Element Style attr.
                            window.styleAttr = element.attr("style");

                            // Add some classes
                            body.addClass("yp-clean-look yp-dragging yp-hide-borders-now");

                            // show position tooltip
                            iframeBody.append("<div class='yp-helper-tooltip'></div>");

                            create_smart_guides();

                            // Delete important tag from old for let to drag elements. Top left right bottom..
                            var corners = ['top','left','right','bottom'],ex;
                            for(var i = 0; i < 4; i++){

                                ex = iframe.find("[data-style='"+get_id(get_current_selector())+"'][data-rule='"+corners[i]+"']");

                                if(ex.length > 0){
                                    ex.html(ex.html().replace(/\s+?!important/g,'').replace(/\;$/g,''));
                                }

                            }


                        },
                        drag: function(event, ui) {

                            if (window.elDragHeight != $(this).outerHeight()) {
                                element.css("width", window.elDragWidth + 1);
                                element.css("height", window.elDragHeight);
                            }

                            // Smart Guides. :-)

                            // tolerance.
                            var t = 6;

                            // Defaults
                            var c,f;

                            // Variables
                            var wLeft,wWidth,wTop,forceH,wHeight,forceW,otherTop,otherLeft,otherWidth,otherHeight,otherBottom,otherRight;

                            // this
                            var self = $(this);

                            // This offets
                            draw_box(".yp-selected", 'yp-selected-boxed');

                            var selfRW = self.outerWidth();
                            var selfTop = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-top").css("top")));
                            var selfLeft = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-left").css("left")));
                            var selfRight = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-right").css("left")));
                            var selfBottom = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-bottom").css("top")));

                            // sizes
                            var selfWidth = selfRight - selfLeft;
                            var selfHeight = selfBottom - selfTop;
                            var selfPLeft = parseFloat(self.css("left"));
                            var selfPTop = parseFloat(self.css("top"));

                            // Margin
                            var selfTopMargin = parseFloat(self.css("marginTop"));
                            var selfLeftMargin = parseFloat(self.css("marginLeft"));

                            // Bottom
                            var yBorder = iframeBody.find(".yp-y-distance-border");
                            var xBorder = iframeBody.find(".yp-x-distance-border");

                            xBorder.css("display", "none");
                            yBorder.css("display", "none");


                            // Search for:
                            // top in top 
                            // bottom in bottom
                            // top in bottom
                            // bottom in top
                            var axsisxEl = iframeBody.find(".yp-smart-guide-elements[data-yp-bottom-round='" + yp_round(selfBottom) + "']");
                            axsisxEl = axsisxEl.add(iframeBody.find(".yp-smart-guide-elements[data-yp-top-round='" + yp_round(selfTop) + "']"));
                            axsisxEl = axsisxEl.add(iframeBody.find(".yp-smart-guide-elements[data-yp-top-round='" + yp_round(selfBottom) + "']"));
                            axsisxEl = axsisxEl.add(iframeBody.find(".yp-smart-guide-elements[data-yp-bottom-round='" + yp_round(selfTop) + "']"));

                            if (axsisxEl.length > 0) {

                                // Getting sizes
                                otherTop = parseFloat(axsisxEl.attr("data-yp-top"));
                                otherLeft = parseFloat(axsisxEl.attr("data-yp-left"));
                                otherWidth = parseFloat(axsisxEl.attr("data-yp-width"));
                                otherHeight = parseFloat(axsisxEl.attr("data-yp-height"));
                                otherBottom = parseFloat(otherTop + otherHeight);
                                otherRight = parseFloat(otherLeft + otherWidth);

                                // Calculate smart guides positions.
                                if (selfLeft > otherLeft) {
                                    wLeft = otherLeft;
                                    wWidth = selfRight - otherLeft;
                                } else {
                                    wLeft = selfLeft;
                                    wWidth = otherRight - selfLeft;
                                }

                                // TOP = TOP
                                if (axsisxEl.attr("data-yp-top-round") == yp_round(selfTop)) {
                                    wTop = otherTop;
                                }

                                // BOTTOM = BOTTOM
                                if (axsisxEl.attr("data-yp-bottom-round") == yp_round(selfBottom)) {
                                    wTop = otherBottom;
                                }

                                // BOTTOM = TOP
                                if (axsisxEl.attr("data-yp-bottom-round") == yp_round(selfTop)) {
                                    wTop = otherBottom;
                                }

                                // TOP = BOTTOM
                                if (axsisxEl.attr("data-yp-top-round") == yp_round(selfBottom)) {
                                    wTop = otherTop;
                                }

                                // controllers
                                c = (ui.offset.top + selfTopMargin) - otherTop;

                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherTop - selfTop) + selfPTop);
                                    ui.position.top = f;
                                    xBorder.css({'top': wTop,'left': wLeft,'width': wWidth,'display': 'block'});
                                }

                                c = (ui.offset.top + selfTopMargin) - otherBottom + selfHeight;

                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherBottom - selfBottom) + selfPTop);
                                    ui.position.top = f;
                                    xBorder.css({'top': wTop,'left': wLeft,'width': wWidth,'display': 'block'});
                                }

                                c = (ui.offset.top + selfTopMargin) - otherTop + selfHeight;

                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherTop - selfBottom) + selfPTop);
                                    ui.position.top = f;
                                    xBorder.css({'top': wTop,'left': wLeft,'width': wWidth,'display': 'block'});
                                }

                                c = (ui.offset.top + selfTopMargin) - otherBottom;

                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherBottom - selfTop) + selfPTop);
                                    ui.position.top = f;
                                    xBorder.css({'top': wTop,'left': wLeft,'width': wWidth,'display': 'block'});
                                }

                            }


                            // Search for:
                            // left in left
                            // right in right
                            // left in right
                            // right in left
                            var axsisyEl = iframeBody.find(".yp-smart-guide-elements[data-yp-right-round='" + yp_round(selfRight) + "']");

                            axsisyEl = axsisyEl.add(iframeBody.find(".yp-smart-guide-elements[data-yp-left-round='" + yp_round(selfLeft) + "']"));

                            axsisyEl = axsisyEl.add(iframeBody.find(".yp-smart-guide-elements[data-yp-left-round='" + yp_round(selfRight) + "']"));

                            axsisyEl = axsisyEl.add(iframeBody.find(".yp-smart-guide-elements[data-yp-right-round='" + yp_round(selfLeft) + "']"));

                            if (axsisyEl.length > 0) {

                                // Getting sizes
                                otherTop = parseFloat(axsisyEl.attr("data-yp-top"));
                                otherLeft = parseFloat(axsisyEl.attr("data-yp-left"));
                                otherWidth = parseFloat(axsisyEl.attr("data-yp-width"));
                                otherHeight = parseFloat(axsisyEl.attr("data-yp-height"));
                                otherBottom = parseFloat(otherTop + otherHeight);
                                otherRight = parseFloat(otherLeft + otherWidth);

                                // Calculate smart guides positions.
                                if (selfTop > otherTop) {
                                    wTop = otherTop;
                                    wHeight = selfBottom - otherTop;
                                } else {
                                    wTop = selfTop;
                                    wHeight = otherBottom - selfTop;
                                }

                                // LEFT = LEFT
                                if (axsisyEl.attr("data-yp-left-round") == yp_round(selfLeft)) {
                                    wLeft = otherLeft;
                                }

                                // RIGHT = RIGHT
                                if (axsisyEl.attr("data-yp-right-round") == yp_round(selfRight)) {
                                    wLeft = otherRight;
                                }

                                // RIGHT = LEFT
                                if (axsisyEl.attr("data-yp-right-round") == yp_round(selfLeft)) {
                                    wLeft = otherRight;
                                }

                                // LEFT = RIGHT
                                if (axsisyEl.attr("data-yp-left-round") == yp_round(selfRight)) {
                                    wLeft = otherLeft;
                                }

                                // controller
                                c = (ui.offset.left + selfLeftMargin) - otherLeft;

                                // Sharpening
                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherLeft - selfLeft) + selfPLeft);
                                    ui.position.left = f;
                                    yBorder.css({'top': wTop,'left': wLeft,'height': wHeight,'display': 'block'});
                                }

                                // controller
                                c = (ui.offset.left + selfLeftMargin) - otherRight;

                                // Sharpening
                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherRight - selfLeft) + selfPLeft);
                                    ui.position.left = f;
                                    yBorder.css({'top': wTop,'left': wLeft,'height': wHeight,'display': 'block'});
                                }

                                // controller
                                c = (ui.offset.left + selfLeftMargin) - otherRight + selfWidth;

                                // Sharpening
                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherRight - selfRight) + selfPLeft);
                                    ui.position.left = f;
                                    yBorder.css({'top': wTop,'left': wLeft,'height': wHeight,'display': 'block'});
                                }

                                // controller
                                c = Math.round((ui.offset.left + selfLeftMargin) - otherLeft + selfRW);

                                // Sharpening
                                if (c < t && c > -Math.abs(t)) {
                                    f = Math.round((otherLeft - selfRight) + selfPLeft - (selfRW - selfWidth));
                                    ui.position.left = f;
                                    yBorder.css({'top': wTop,'left': wLeft,'height': wHeight,'display': 'block'});
                                }

                            }


                            if (ui.position.top == 1 || ui.position.top == -1 || ui.position.top == 2 || ui.position.top == -2) {
                                ui.position.top = 0;
                            }

                            if (ui.position.left == 1 || ui.position.left == -1 || ui.position.left == 2 || ui.position.left == -2) {
                                ui.position.left = 0;
                            }

                            // Update helper tooltip
                            if (selfTop >= 60) {
                                iframeBody.find(".yp-helper-tooltip").css({
                                    'top': selfTop,
                                    'left': selfLeft
                                }).html("X : " + parseInt(ui.position.left) + " px<br>Y : " + parseInt(ui.position.top) + " px");
                            } else {
                                iframeBody.find(".yp-helper-tooltip").css({
                                    'top': selfTop + selfHeight + 40 + 10,
                                    'left': selfLeft
                                }).html("X : " + parseInt(ui.position.left) + " px<br>Y : " + parseInt(ui.position.top) + " px");
                            }

                        },
                        stop: function() {

                            clean_smart_guides();

                            window.styleData = 'relative';

                            var delay = 1;

                            // CSS To Data.
                            if (mainBody.hasClass("yp-need-to-process")) {
                                process(false, false);
                                delay = 70;
                            }

                            // Draw tooltip qiuckly
                            draw_tooltip();

                            // Wait for process.
                            setTimeout(function() {

                                var t = element.css("top");
                                var l = element.css("left");
                                var b = element.css("bottom");
                                var r = element.css("right");


                                // Back To Orginal Style Attr.
                                if (isDefined(window.styleAttr)) {

                                    var trimAtr = window.styleAttr.replace(/position:(\s*?)relative(\;?)/g,"");

                                    if (trimAtr == '') {
                                        element.removeAttr("style");
                                    } else {
                                        element.attr("style", trimAtr);
                                    }

                                } else {
                                    element.removeAttr("style");
                                }


                                // Insert new data.
                                insert_rule(null, "top", t, '');
                                insert_rule(null, "left", l, '');

                                if (parseFloat(t) + parseFloat(b) !== 0) {
                                    insert_rule(null, "bottom", "auto", '');
                                }

                                if (parseFloat(l) + parseFloat(r) !== 0) {
                                    insert_rule(null, "right", "auto", '');
                                }

                                // Adding styles
                                if (element.css("position") == 'static') {
                                    insert_rule(null, "position", "relative", '');
                                }

                                if ($("#position-static").parent().hasClass("active") || $("#position-relative").parent().hasClass("active")) {
                                    $("#position-relative").trigger("click");
                                }

                                // Set default values for top and left options.
                                if ($("li.position-option.active").length > 0) {
                                    $("#top-group,#left-group").each(function() {
                                        set_default_value(get_option_id(this));
                                    });
                                } else {
                                    $("li.position-option").removeAttr("data-loaded"); // delete cached data.
                                }

                                // Remove
                                iframe.find(".yp-selected,.yp-selected-others").removeClass("ui-draggable-handle ui-draggable-handle");

                                // Update css.
                                option_change();

                                body.removeClass("yp-clean-look yp-dragging yp-hide-borders-now");

                                draw();

                                gui_update();

                            }, delay);

                        }

                    });

                }

            }


            /* ---------------------------------------------------- */
            /* Get Handler                                          */
            /* ---------------------------------------------------- */
            function update_drag_handle_position() {

                // Element selected?
                if (!is_content_selected()) {
                    return false;
                }

                // element
                var element = get_selected_element();

                // Add new
                if (element.height() > 20 && element.width() > 60 && iframe.find(".yp-selected-handle").length === 0) {
                    iframeBody.append("<span class='yp-selected-handle'></span>");
                }

                iframe.find(".yp-selected-handle").css("left", iframe.find(".yp-selected-boxed-right").css("left"));
                iframe.find(".yp-selected-handle").css("top", iframe.find(".yp-selected-boxed-bottom").css("top"));
                iframe.find(".yp-selected-handle").css("opacity", iframe.find(".yp-selected-boxed-bottom").css("opacity"));

            }

            window.mouseisDown = false;
            window.styleAttrBeforeChange = null;
            window.visualResizingType = null;
            window.ResizeSelectedBorder = null;
            window.elementOffsetLeft = null;
            window.elementOffsetRight = null;

            function get_domain(url) {
                var domain;
                if (url.indexOf("://") > -1) {
                    domain = url.split('/')[2];
                } else {
                    domain = url.split('/')[0];
                }
                domain = domain.split(':')[0];
                return $.trim(domain);
            }

            var get_absolute_path = function(href){
                var link = document.createElement("a");
                link.href = href;
                return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
            };

            iframe.find('a[href]').on("click", iframe, function(evt) {

                $(this).attr("target", "_self");

                if(mainBody.hasClass("yp-metric-disable") === false){
                    return false;
                }

                // if aim mode disable.
                if ($(".yp-selector-mode.active").length === 0) {

                    var href = $(this).attr("href");

                    if (href == '') {
                        return false;
                    }

                    // Get full URL
                    href = get_absolute_path(href);

                    if (href.indexOf("#noAiming") > -1) {
                        swal({title: "Sorry.",text: "This link is not an wordpress page. You can't edit this page.",type: "warning",animation: false});
                        return false;
                    }

                    if (href !== null && href != '' && href.charAt(0) != '#' && href.indexOf("javascript:") == -1 && href.indexOf("yellow_pencil=true") == -1) {

                        var link_host = get_domain(href);
                        var main_host = window.location.hostname;

                        if (link_host != main_host) {
                            swal({title: "Sorry.",text: "This is external link. You can't edit this page.",type: "warning",animation: false});
                            return false;
                        }

                        if (href.indexOf(siteurl.split("://")[1]) == -1 || href.indexOf("wp-login.php?action=logout") != -1) {
                            swal({title: "Sorry.",text: "This link is not an wordpress page. You can't edit this page.",type: "warning",animation: false});
                            return false;
                        }

                        // https to http
                        if (location.protocol == 'http:' && href.indexOf('https:') != -1 && href.indexOf('http:') == -1) {
                            href = href.replace("https:", "http:");
                            $(this).attr("href", href);
                        }

                        // Http to https
                        if (location.protocol == 'https:' && href.indexOf('http:') != -1 && href.indexOf('https:') == -1) {
                            href = href.replace("http:", "https:");
                            $(this).attr("href", href);
                        }

                        // if selector mode not active and need to save.
                        if ($(".yp-save-btn").hasClass("waiting-for-save")){
                            if (confirm(l18_sure) == true) {
                                $(".waiting-for-save").removeClass("waiting-for-save");
                            } else {
                                return false;
                            }
                        }

                    } else {
                        return false;
                    }

                    $("#iframe").remove();
                    body.removeClass("yp-yellow-pencil-loaded");
                    $(".loading-files").html("Page loading..");

                    // Get parent url
                    var parentURL = window.location;

                    //delete after href.
                    parentURL = parentURL.toString().split("href=")[0] + "href=";

                    // get iframe url
                    var newURL = href;
                    if (newURL.substring(0, 6) == 'about:') {
                        $(this).show();
                        return false;
                    }

                    var isAdmin = false;
                    $.get(newURL, function(data){

                        mainBody.append("<div id='yp-load-test-admin'></div>");

                        if(data.match(/adminmenumain/g)){
                            isAdmin = true;
                        }

                        newURL = newURL.replace(/.*?:\/\//g, ""); // delete protocol
                        newURL = newURL.replace("&yellow_pencil_frame=true", "").replace("?yellow_pencil_frame=true", "");
                        newURL = encodeURIComponent(newURL); // encode url
                        parentURL = parentURL + newURL; // update parent URL

                        // Check if is admin?
                        if(body.hasClass(("yp-wordpress-admin-editing") && isAdmin)){
                            parentURL = parentURL + '&yp_type=wordpress_panel';
                        }

                        window.location = parentURL;

                    });

                    

                }

            });


            /* ---------------------------------------------------- */
            /* Cancel Selected El. And Select The Element Function  */
            /* ---------------------------------------------------- */
            iframe.on("click", iframe, function(evt) {

                if ($(".yp-selector-mode.active").length > 0 && mainBody.hasClass("yp-metric-disable")) {

                    if (evt.which == 1 || evt.which === undefined) {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }


                    // Not clickable while animate playing
                    if(body.hasClass("yp-animate-manager-playing")){
                        return false;
                    }

                    // Resized
                    if (body.hasClass("yp-element-resized") || body.hasClass("resize-time-delay")) {
                        body.removeClass("yp-element-resized resize-time-delay");
                        return false;
                    }

                    // Colorpicker for all elements.
                    if (mainBody.hasClass("yp-element-picker-active")) {
                        $(".yp-element-picker-active").removeClass("yp-element-picker-active");
                        $(".yp-element-picker.active").removeClass("active");
                        return false;
                    }

                    if ($(".yp_flat_colors_area:visible").length !== 0) {

                        $(".yp-flat-colors.active").each(function() {
                            $(this).trigger("click");
                        });

                        return false;

                    }

                    if ($(".yp_meterial_colors_area:visible").length !== 0) {

                        $(".yp-meterial-colors.active").each(function() {
                            $(this).trigger("click");
                        });

                        return false;

                    }

                    if ($(".yp_nice_colors_area:visible").length !== 0) {

                        $(".yp-nice-colors.active").each(function() {
                            $(this).trigger("click");
                        });

                        return false;

                    }

                    if ($(".iris-picker:visible").length !== 0) {

                        $(".iris-picker:visible").each(function() {
                            $(this).hide();
                        });

                        return false;

                    }

                    if ($(".yp_background_assets:visible").length !== 0) {

                        $(".yp-bg-img-btn.active").each(function() {
                            $(this).trigger("click");
                        });

                        return false;

                    }

                    if (mainBody.hasClass("autocomplete-active")) {

                        $(".input-autocomplete").each(function() {
                            $(this).autocomplete("close");
                        });

                        return false;

                    }

                    if (is_content_selected() === true) {

                        // CSS To Data.
                        if (mainBody.hasClass("yp-need-to-process")) {
                            process(false, false);
                        }

                        if (iframe.find(".context-menu-active").length > 0) {
                            get_selected_element().contextMenu("hide");
                            return false;
                        }

                    }

                    var element = $(evt.target);
                    var element_offset;

                    if (evt.which === undefined || evt.which == 1) {

                        if (is_content_selected() === true) {

                            if(element.hasClass("yp-edit-edit") || element.hasClass("yp-edit-style")){
                                return false;
                            }

                            if (element.hasClass("yp-edit-menu") && element.hasClass("yp-content-selected") === false) {
                                element_offset = element.offset();
                                var x = element_offset.left;
                                if (x === 0) {
                                    x = 1;
                                }
                                var y = element_offset.top + 26;
                                get_selected_element().contextMenu({
                                    x: x,
                                    y: y
                                });
                                return false;
                            }

                            if (element.hasClass("yp-selected-tooltip")) {
                                $(".yp-button-target").trigger("click");
                                return false;
                            } else if (element.parent().length > 0) {
                                if (element.parent().hasClass("yp-selected-tooltip")) {
                                    $(".yp-button-target").trigger("click");
                                    return false;
                                }
                            }

                        }

                    }

                    if (body.hasClass("yp-selector-disabled")) {
                        return false;
                    }

                    if (body.hasClass("yp-disable-disable-yp")) {
                        return false;
                    }

                    var selector = get_parents(element, "default");

                    if (mainBody.hasClass("autocomplete-active") && selector == 'body') {
                        return false;
                    }

                    if (evt.which == 1 || evt.which === undefined) {

                        if (element.hasClass("yp-selected") === false) {

                            if (is_content_selected() === true && element.parents(".yp-selected").length != 1) {

                                if (is_animate_creator() && is_dragging() === false) {
                                    if (!confirm(l18_closeAnim)) {
                                        return false;
                                    } else {
                                        yp_anim_cancel();
                                        return false;
                                    }
                                }

                                // Multiable Selector
                                if(is_content_selected() && mainBody.hasClass("yp-control-key-down")){

                                    if(element.hasClass("yp-selected-others-box") === false){

                                        var selectorCurrent = get_current_selector();
                                        var selectorNew = get_parents(element, "sharp");
                                        iframe.find(".yp-selected-others-multiable-box").remove();
                                        iframe.find(".yp-multiple-selected").addClass("yp-selected-others").removeClass("yp-multiple-selected");
                                        set_selector(selectorCurrent+","+selectorNew,get_selected_element());

                                        // Disable focus style after clicked.
                                        element.blur();

                                    }


                                    return false;

                                }

                                // remove ex
                                clean();

                                element_leave();

                                // Quick update
                                iframe.find(evt.target).trigger("mouseover");

                            }

                        } else {

                            if (is_content_selected() === false){

                                if (check_with_parents(element, "transform", "none", "!=") === true){
                                    body.addClass("yp-has-transform");
                                }

                                // Set selector as  body attr.
                                body.attr("data-clickable-select", selector);

                                set_draggable(element);

                                // RESIZE ELEMENTS
                                window.visualResizingType = 'width';
                                window.ResizeSelectedBorder = "right";
                                window.styleAttrBeforeChange = element.attr("style");

                                element_offset = element.offset();
                                window.elementOffsetLeft = element_offset.left;
                                window.elementOffsetRight = element_offset.right;

                                element.width(parseFloat(element.width() + 10));

                                if (window.elementOffsetLeft == element_offset.left && window.elementOffsetRight != element_offset.right) {
                                    window.ResizeSelectedBorder = "right";
                                } else if (window.elementOffsetLeft != element_offset.left && window.elementOffsetRight == element_offset.right && element.css("text-align") != 'center') {
                                    window.ResizeSelectedBorder = "left";
                                } else {
                                    window.ResizeSelectedBorder = "right";
                                }

                                if (isDefined(window.styleAttrBeforeChange)) {
                                    element.attr("style", window.styleAttrBeforeChange);
                                } else {
                                    element.removeAttr("style");
                                    window.styleAttrBeforeChange = null;
                                }

                                // element selected
                                body.addClass("yp-content-selected");

                                window.orginalHeight = parseFloat(element.css("height").replace(/px/g,''));
                                window.orginalWidth = parseFloat(element.css("width").replace(/px/g,''));

                                if(element.css("float") == 'right'){
                                    body.addClass("yp-element-float");
                                }else{
                                    body.removeClass("yp-element-float");
                                }

                                css_editor_toggle(true); // show if hide

                                // Disable focus style after clicked.
                                element.blur();

                                if(body.hasClass("yp-animate-manager-active")){
                                    animation_manager();
                                }

                                // Update the element informations.
                                if($(".advanced-info-box").css("display") == 'block' && $(".element-btn").hasClass("active")){
                                    update_design_information("element");
                                }

                            }

                        }

                    } else {

                        var hrefAttr = $(evt.target).attr("href");

                        // If has href
                        if (isDefined(hrefAttr)) {

                            if (evt.which == 1 || evt.which === undefined) {
                                evt.stopPropagation();
                                evt.preventDefault();
                            }

                            return false;

                        }

                    }

                    draw();
                    gui_update();

                }

            });

            

            function create_smart_guides(){

                if(body.hasClass("yp-smart-guide-disabled") || mainBody.hasClass("yp-has-transform")){
                    return false;
                }

                var maxWidth = 0;
                var maxWidthEl = null;
                var k = $(window).width();

                // Smart guides: START
                var Allelements = iframeBody.find(get_all_elements(":not(ul li)"));

                for (var i=0; i < Allelements.length; i++){ 

                    // Element
                    var el = $(Allelements[i]);
                    var otherWidth = el.outerWidth();


                    // 720 768 940 960 980 1030 1040 1170 1210 1268
                    if(otherWidth >= 720 && otherWidth <= 1268 && otherWidth < (k-80)){

                        if(otherWidth > maxWidth){
                            maxWidthEl = el;
                        }

                        maxWidth = Math.max(otherWidth, maxWidth);

                    }


                    if(el.parents(".yp-selected").length <= 0 && el.parents(".yp-selected-others").length <= 0 && el.css("display") != 'none' && el.css("opacity") != "0" && el.css("visibility") != 'hidden' && el.height() >= 10){ 
                            
                        var offset = el.offset();

                        // Getting sizes
                        var otherTop = Math.round(offset.top);
                        var otherLeft = Math.round(offset.left);
                        var otherHeight = Math.round(el.outerHeight());

                            // don't add "inner" same size elements.
                            if(iframeBody.find('[data-yp-top="'+otherTop+'"][data-yp-left="'+otherLeft+'"][data-yp-width="'+otherWidth+'"][data-yp-height="'+otherHeight+'"]').length <= 0){

                                // Saving for use on drag event.
                                // faster performance.
                                el.addClass("yp-smart-guide-elements")
                                .attr("data-yp-top",otherTop)
                                .attr("data-yp-left",otherLeft)
                                .attr("data-yp-top-round",yp_round(otherTop))
                                .attr("data-yp-bottom-round",yp_round(otherTop+otherHeight))
                                .attr("data-yp-left-round",yp_round(otherLeft))
                                .attr("data-yp-right-round",yp_round(otherLeft+otherWidth))
                                .attr("data-yp-width",otherWidth)
                                .attr("data-yp-height",otherHeight);
                            }

                        }

                }

                // Not adding on responsive mode.
                if(maxWidthEl !== null){

                    var Pleft = maxWidthEl.offset().left;

                    if(Pleft > 50){

                        var Pright = Pleft+maxWidth;

                        if(parseInt(Pleft) == parseInt(iframe.width()-Pright)){
                        
                            iframeBody.append("<div class='yp-page-border-left' style='left:"+Pleft+"px;'></div><div class='yp-page-border-right' style='left:"+Pright+"px;'></div>");

                        }

                    }

                }

                // Adding distance borders
                iframeBody.append("<div class='yp-x-distance-border'></div><div class='yp-y-distance-border'></div>");

            }


            function clean_smart_guides(){

                iframeBody.find(".yp-page-border-left,.yp-page-border-right").remove();

                // Removing distance borders
                iframeBody.find(".yp-x-distance-border,.yp-y-distance-border,.yp-helper-tooltip").remove();

                iframeBody.find(".yp-smart-guide-elements").removeClass("yp-smart-guide-elements")
                    .removeAttr("data-yp-top")
                    .removeAttr("data-yp-left")
                    .removeAttr("data-yp-width")
                    .removeAttr("data-yp-top-round")
                    .removeAttr("data-yp-bottom-round")
                    .removeAttr("data-yp-left-round")
                    .removeAttr("data-yp-right-round")
                    .removeAttr("data-yp-height");

            }


            // RESIZE: WIDTH HANDLER
            iframe.on("mousedown", '.yp-selected-boxed-left,.yp-selected-boxed-right', function(event) {

            var element = $(this);

            // if float not right, left disable
            if(body.hasClass("yp-element-float") == false && element.hasClass("yp-selected-boxed-left")){
                return false;
            }

            body.addClass("resize-time-delay");

            clearTimeout(window.resizeDelay);
            window.resizeDelay = setTimeout(function(){

                if (is_content_selected() === false) {
                    return false;
                }

                window.visualResizingType = 'width';

                if (element.hasClass("yp-selected-boxed-left")) {
                    window.ResizeSelectedBorder = "left";
                } else {
                    window.ResizeSelectedBorder = "right";
                }

                window.mouseisDown = true;

                var el = iframeBody.find(".yp-selected");

                window.mouseDownX = el.offset().left;
                window.exWidthX = parseFloat(el.css("width"));
                window.exWidthY = null;
                window.currentMarginLeft = parseFloat(el.css("marginLeft"));

                window.maxData = {width: parseFloat(el.css("maxWidth")), height: parseFloat(el.css("maxHeight"))};
                window.minData = {width: parseFloat(el.css("minWidth")), height: parseFloat(el.css("minHeight"))};


                // Try to use % Percent format
                var widthPercent = calcature_smart_sizes(get_selected_element(),get_selected_element().css('width'));
                window.liveResizeWPercent = false;
                if(widthPercent.format == '%'){
                    window.liveResizeWPercent = true;
                }

                // Get saved sata from CSS editor.
                if(widthPercent.format != '%' && get_data_value(get_current_selector(),'width',true) == true){

                    var data = get_data_value(get_current_selector(),'width',false);
                    
                    if(data.indexOf("%") != -1){
                        window.liveResizeWPercent = true;
                    }

                }

                body.addClass("yp-element-resizing yp-clean-look");

                // Close contextmenu
                if (iframe.find(".context-menu-active").length > 0) {
                    get_selected_element().contextMenu("hide");
                }

                // show size tooltip
                iframeBody.append("<div class='yp-helper-tooltip'></div>");

                create_smart_guides();

            },150);

            });

            // RESIZE:HEIGHT HANDLER
            iframe.on("mousedown", '.yp-selected-boxed-bottom', function(event) { // removed since 5.5.6 .yp-selected-boxed-top

            var element = $(this);

            body.addClass("resize-time-delay");

            clearTimeout(window.resizeDelay);
            window.resizeDelay = setTimeout(function(){

                if (is_content_selected() === false) {
                    return false;
                }

                // Update variables
                window.mouseisDown = true;

                window.visualResizingType = 'height';
                
                if (element.hasClass("yp-selected-boxed-top")) {
                    window.ResizeSelectedBorder = "top";
                } else {
                    window.ResizeSelectedBorder = "bottom";
                }

                var el = iframeBody.find(".yp-selected");

                window.mouseDownY = el.offset().top;
                window.exWidthY = parseFloat(el.css("height"));
                window.exWidthX = null;
                window.currentMarginTop = parseFloat(el.css("marginTop"));

                window.maxData = {width: parseFloat(el.css("maxWidth")), height: parseFloat(el.css("maxHeight"))};
                window.minData = {width: parseFloat(el.css("minWidth")), height: parseFloat(el.css("minHeight"))};

                body.addClass("yp-element-resizing yp-clean-look");

                // Close contextmenu
                if (iframe.find(".context-menu-active").length > 0) {
                    get_selected_element().contextMenu("hide");
                }

                // Removing classes.
                iframe.find(get_current_selector()).removeClass("yp_selected yp_onscreen yp_hover yp_focus yp_click");

                // show size tooltip
                iframeBody.append("<div class='yp-helper-tooltip'></div>");

                create_smart_guides();

            },150);

            });



            // RESIZE:RESIZING
            iframe.on("mousemove", iframe, function(event) {

                // Record mousemoves after element selected.
                window.lastTarget = event.target;

                if (window.mouseisDown === true) {

                    var yBorder = iframeBody.find(".yp-y-distance-border");
                    var xBorder = iframeBody.find(".yp-x-distance-border");

                    event = event || window.event;

                    // cache
                    var element = get_selected_element();

                    var elof = element.offset();

                    // Convert display inline to inline-block.
                    if (element.css("display") == 'inline') {
                        insert_rule(null, "display", "inline-block", "");
                    }

                    var format = 'px';

                    if(window.liveResizeWPercent == true){
                        format = '%';
                    }

                    var width,smartData,height,dif;

                    // If width
                    if (window.visualResizingType == "width") {

                        if (window.ResizeSelectedBorder == 'left'){
                            width = Math.round(elof.left) + Math.round(element.outerWidth()) - Math.round(event.pageX);
                        } else {
                            width = Math.round(event.pageX) - Math.round(elof.left);
                        }
                        

                        // Min 4px
                        if ((format == 'px' && width > 4) || (format == '%' && width > 2)) {

                            if (element.css("boxSizing") == 'content-box') {
                                width = width - Math.round(parseFloat(element.css("paddingLeft"))) - Math.round(parseFloat(element.css("paddingRight")));
                            }

                            // calcature smart sizes. 100% etc
                            smartData = calcature_smart_sizes(element,width);

                            // Update
                            width = smartData.val;
                            format = smartData.format;

                            if(window.wasLockX === false){
                                if (window.ResizeSelectedBorder == 'left'){
                                    dif = Math.round(event.pageX)-Math.round(window.mouseDownX)+window.currentMarginLeft;
                                    element.cssImportant("margin-left", dif + "px");
                                }

                                element.cssImportant("width", width + format);

                            }

                            draw_box(".yp-selected", 'yp-selected-boxed');

                        }

                        body.addClass("yp-element-resizing-width-" + window.ResizeSelectedBorder);

                    } else if (window.visualResizingType == "height") { // else height

                        if (window.ResizeSelectedBorder == 'top') {
                            height = Math.round(elof.top+element.outerHeight()) - Math.round(event.pageY);
                        } else {
                            height = Math.round(event.pageY) - Math.round(elof.top);
                        }

                        // Min 4px
                        if (format == 'px' && height > 4){

                            if (element.css("boxSizing") == 'content-box') {
                                height = height - Math.round(parseFloat(element.css("paddingTop"))) - Math.round(parseFloat(element.css("paddingBottom")));
                            }

                            if(window.wasLockY === false){
                                if (window.ResizeSelectedBorder == 'top'){
                                    dif = Math.round(event.pageY)-Math.round(window.mouseDownY)+window.currentMarginTop;
                                    element.cssImportant("margin-top", dif + "px");
                                }
                                element.cssImportant("height", height + format);
                            }

                            draw_box(".yp-selected", 'yp-selected-boxed');

                        }

                        body.addClass("yp-element-resizing-height-" + window.ResizeSelectedBorder);

                    }

                    var tooltipContent = '';
                    var roundedNum = 0;

                    // Update helper tooltip
                    if(window.visualResizingType == "width"){
                        if(width < 5 && format == 'px'){width = 5;}else if(width < 2){width = 2;}
                        if(format == '%'){roundedNum = Math.round(width * 10) / 10;}else{roundedNum = Math.round(width);}
                        tooltipContent = 'W : '+roundedNum + format;
                    }else{
                        if(height < 5){height = 5;}
                        roundedNum = Math.round(height);
                        tooltipContent = 'H : '+roundedNum + format;
                    }


                    // Show : initial at tooltip when resize at default value
                    if(window.visualResizingType == "height"){
                        if(parseInt(window.orginalHeight) == parseInt(height)){
                            tooltipContent = 'H : ' + "initial - " + window.orginalHeight + "px";
                        }
                    }else{
                        if(parseInt(window.orginalWidth) == parseInt(width)){
                            tooltipContent = 'W : ' + "initial - " + window.orginalWidth + "px";
                        }
                    }


                    // offsets
                    var selfTop = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-top").css("top")));
                    var selfLeft = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-left").css("left")));
                    var selfRight = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-right").css("left")));
                    var selfBottom = Math.round(parseFloat(iframeBody.find(".yp-selected-boxed-bottom").css("top")));

                    // Variables
                    var wLeft,wWidth,wTop,forceH,wHeight,forceW,otherTop,otherLeft,otherWidth,otherHeight,otherBottom,otherRight;

                    // Create smart guides for height.
                    if(window.visualResizingType == "height"){

                        xBorder.css("display","none");
                        window.wasLockY = false;

                        var axsisxEl = iframeBody.find(".yp-smart-guide-elements[data-yp-top-round='"+yp_round(event.pageY)+"'],.yp-smart-guide-elements[data-yp-bottom-round='"+yp_round(event.pageY)+"']").first();

                        if(axsisxEl.length > 0){

                            // Getting sizes
                            otherTop = parseFloat(axsisxEl.attr("data-yp-top"));
                            otherLeft = parseFloat(axsisxEl.attr("data-yp-left"));
                            otherWidth = parseFloat(axsisxEl.attr("data-yp-width"));
                            otherHeight = parseFloat(axsisxEl.attr("data-yp-height"));
                            otherBottom = parseFloat(otherTop+otherHeight);
                            otherRight = parseFloat(otherLeft+otherWidth);

                            // Calculate smart guides positions.
                            if(selfLeft > otherLeft){
                                wLeft = otherLeft;
                                wWidth = selfRight-wLeft;
                            }else{
                                wLeft = selfLeft;
                                wWidth = otherRight-selfLeft;
                            }

                            // Find top or bottom.
                            if(axsisxEl.attr("data-yp-top-round") == yp_round(event.pageY)){
                                wTop = otherTop;
                                forceH = otherTop-selfTop;
                            }else{
                                wTop = otherBottom;
                                forceH = otherBottom-selfTop;
                            }

                            if(window.ResizeSelectedBorder != 'top'){
                                element.cssImportant("height", forceH + format);
                                window.wasLockY = true;
                            }else{
                                forceH = height;
                            }

                            xBorder.css({'top':wTop,'left':wLeft,'width':wWidth,'display':'block'});

                            if(forceH < 5){forceH = 5;}
                            roundedNum = Math.round(forceH);

                            tooltipContent = 'H : '+roundedNum + format;

                        }

                        // Show : initial at tooltip when resize at default value
                        if(parseInt(window.orginalHeight) == parseInt(forceH)){
                            tooltipContent = 'H : ' + "initial - " + window.orginalHeight + "px";
                        }

                    }

                    // Create smart guides for width.
                    if(window.visualResizingType == "width"){

                        window.wasLockX = false;
                        yBorder.css("display","none");

                        var axsisyEl = iframeBody.find(".yp-smart-guide-elements[data-yp-left-round='"+yp_round(event.pageX)+"'],.yp-smart-guide-elements[data-yp-right-round='"+yp_round(event.pageX)+"']").first();

                        if(axsisyEl.length > 0){

                            // Getting sizes
                            otherTop = parseFloat(axsisyEl.attr("data-yp-top"));
                            otherLeft = parseFloat(axsisyEl.attr("data-yp-left"));
                            otherWidth = parseFloat(axsisyEl.attr("data-yp-width"));
                            otherHeight = parseFloat(axsisyEl.attr("data-yp-height"));
                            otherBottom = parseFloat(otherTop+otherHeight);
                            otherRight = parseFloat(otherLeft+otherWidth);

                            // Calculate smart guides positions.
                            if(selfTop > otherTop){
                                wTop = otherTop;
                                wHeight = selfBottom-otherTop;
                            }else{
                                wTop = selfTop;
                                wHeight = otherBottom-selfTop;
                            }

                            // Find top or bottom.
                            if(axsisyEl.attr("data-yp-left-round") == yp_round(event.pageX)){
                                wLeft = otherLeft;
                                forceW = otherLeft-selfLeft;
                            }else{
                                wLeft = otherRight;
                                forceW = otherRight-selfLeft;
                            }


                            // calcature smart sizes. 100% etc
                            smartData = calcature_smart_sizes(element,forceW);

                            // Update
                            forceW = smartData.val;
                            format = smartData.format;


                            if(window.ResizeSelectedBorder != 'left'){
                                element.cssImportant("width", forceW + format);
                                window.wasLockX = true;
                            }else{
                                forceW = width;
                            }

                            yBorder.css({'top':wTop,'left':wLeft,'height':wHeight,'display':'block'});

                            if(format == '%'){
                                if(forceW < 2){forceW = 2;}
                                roundedNum = Math.round(forceW * 10) / 10;
                            }else{
                                if(forceW < 5){forceW = 5;}
                                roundedNum = Math.round(forceW);
                            }
                            tooltipContent = 'W : '+roundedNum + format;

                        }

                        // Show : initial at tooltip when resize at default value
                        if(parseInt(window.orginalWidth) == parseInt(forceW)){
                            tooltipContent = 'W : ' + "initial - " + window.orginalWidth + "px";
                        }

                    }

                    // Update helper tooltip
                    iframeBody.find(".yp-helper-tooltip").css({'top':event.pageY,'left':event.pageX+30}).html(tooltipContent);


                }

            });


            function calcature_smart_sizes(element,val){

                // Variable
                var result = [];

                var founded = false;

                // Check parent details.
                if(element.parent().length > 0){

                    // IF not any inline or table display
                    if(element.parent().css("display").indexOf("table") == -1 && element.parent().css("display") != 'inline' && element.parent().css("display") != 'inline-flex'){

                        var parentWidth = element.parent().width();

                        // if start width percent, use automatic percent all time while resizing.
                        if(window.liveResizeWPercent == true){

                            // Flag
                            founded = true;

                            // Update
                            result.val = Math.round((parseFloat(val)*100/parseFloat(parentWidth)) * 10 ) / 10;
                            result.format = '%';

                            
                        }

                        // if width is same with parent width, so set 100%!
                        if (parseInt(parentWidth) == parseInt(val) && founded == false) {

                            // Flag
                            founded = true;

                            // Update
                            result.val = 100;
                            result.format = '%';

                        }

                        // if width is 50% with parent width, so set 50%!
                        if (parseInt(parentWidth/2) == parseInt(val) && founded == false) {

                            // Flag
                            founded = true;

                            // Update
                            result.val = 50;
                            result.format = '%';

                        }

                        // if width is 25% with parent width, so set 25%!
                        if (parseInt(parentWidth/4) == parseInt(val) && founded == false) {

                            // Flag
                            founded = true;

                            // Update
                            result.val = 25;
                            result.format = '%';

                        }

                        // if width is 20% with parent width, so set 20%!
                        if (parseInt(parentWidth/5) == parseInt(val) && founded == false) {

                            // Flag
                            founded = true;

                            // Update
                            result.val = 20;
                            result.format = '%';

                        }

                    }

                }

                // Return default
                if(founded === false){
                    result.val = val;
                    result.format = 'px';
                }

                return result;

            }


            // RESIZE:STOP
            iframe.on("mouseup", iframe, function() {

                clearTimeout(window.resizeDelay);

                if (is_resizing()) {

                    clean_smart_guides();

                    // show size tooltip
                    iframeBody.find(".yp-helper-tooltip").remove();

                    body.addClass("yp-element-resized");

                    var delay = 1;

                    // CSS To Data.
                    if (mainBody.hasClass("yp-need-to-process")) {
                        process(false, false);
                        delay = 70;
                    }

                    // Wait for process.
                    setTimeout(function() {

                        var bWidth;
                        if(window.visualResizingType == 'width'){
                            bWidth = window.exWidthX;
                        }else{
                            bWidth = window.exWidthY;
                        }

                        // cache
                        var element = get_selected_element();

                        // get result
                        var width = parseFloat(element.css(window.visualResizingType)).toString();
                        var format = 'px';
                        var widthCa = width;

                        // width 100% for screen
                        if (window.visualResizingType == 'width') {
                            
                            // calcature smart sizes. 100% etc
                            var smartData = calcature_smart_sizes(element,width);

                            // Update
                            width = smartData.val;
                            format = smartData.format;

                        }

                        if(window.exWidthX !== null && window.ResizeSelectedBorder == 'left' && widthCa != bWidth){
                            insert_rule(null,"margin-left",parseFloat(element.css("marginLeft")),'px');
                        }

                        if(window.exWidthY !== null && window.ResizeSelectedBorder == 'top' && widthCa != bWidth){
                            insert_rule(null,"margin-top",parseFloat(element.css("marginTop")),'px');
                        }

                        //return to default
                        if (isDefined(window.styleAttrBeforeChange)) {
                            element.attr("style", window.styleAttrBeforeChange);
                        } else {
                            element.removeAttr("style");
                        }

                        // insert to data.
                        if(widthCa != bWidth){

                            // Set just min height if new value higher than old
                            if(window.visualResizingType == 'height' && widthCa > window.orginalHeight){

                                var exStyle = iframe.find("." + get_id(get_current_selector()) + '-' + "height" + '-style[data-size-mode="' + get_media_condition() + '"]');
                                if (exStyle.length > 0) {exStyle.remove();}

                                insert_rule(null, "min-height", width, format);

                            }else{

                                insert_rule(null, window.visualResizingType, width, format);

                            }

                        }

                        body.removeClass("yp-element-resizing yp-clean-look yp-element-resizing-height-bottom yp-element-resizing-width-left yp-element-resizing-width-right yp-element-resizing-height-top");


                        // If width/height large than max width/height
                        if(window.maxData[window.visualResizingType] < width){
                            insert_rule(null, "max-"+window.visualResizingType, width, format);
                        }

                        // If width large than max width/height
                        if(window.minData[window.visualResizingType] > width){
                            insert_rule(null, "min-"+window.visualResizingType, width, format);
                        }

                        draw();

                        // Update
                        option_change();

                        // Set default values for top and left options.
                        $.each(['width','height','max-width','max-height','min-width','min-height','margin-left','margin-top'], function(i, v) {
                            set_default_value(v);
                        });
                        
                        window.mouseisDown = false;
                        window.liveResizeWPercent = false;

                        draw();

                    }, delay);

                    setTimeout(function() {
                        body.removeClass("yp-element-resized resize-time-delay");
                    }, 100);

                }

            });


            function yp_round(x){
                return Math.round(x / 6) * 6;
            }

            // Load default value after setting pane hover
            // because I not want load ":hover" values.
            body.on('mousedown', '.yp-editor-list > li:not(.yp-li-footer):not(.yp-li-about):not(.active)', function() {

                if (is_content_selected() === true) {

                    // Get data
                    var data = $(this).attr("data-loaded");

                    // If no data, so set.
                    if (typeof data == typeof undefined || data === false) {

                        // Set default values
                        $(this).find(".yp-option-group").each(function() {
                            set_default_value(get_option_id(this));
                        });

                        // cache to loaded data.
                        $(this).attr("data-loaded", "true");

                    }

                }

            });


            // Update boxes while mouse over and out selected elements.
            iframe.on("mouseout mouseover", '.yp-selected', function() {

                if (is_content_selected() == true && is_resizing() == false && is_dragging() == false) {

                    clearTimeout(window.update_drawmouseOver);
                    window.update_drawmouseOver = setTimeout(function() {
                        draw();
                    }, 50);

                }

            });


            // Used by smart guides etc.
            function get_all_elements(custom){

                var selector = '*';

                var notSelectors = [
                    ".yp-x-distance-border",
                    ".yp-y-distance-border",
                    ".hover-info-box",
                    ".yp-size-handle",
                    ".yp-edit-tooltip",
                    ".yp-edit-menu",
                    ".yp-edit-edit",
                    ".yp-edit-style",
                    ".yp-selected-tooltip",
                    ".yp-tooltip-small",
                    ".yp-helper-tooltip",
                    "[class^='yp-selected-boxed-']",
                    "[class^='yp-selected-others-box']",
                    "link",
                    "style",
                    "script",
                    "param",
                    "option",
                    "tr",
                    "td",
                    "th",
                    "thead",
                    "tbody",
                    "tfoot",
                    "iframe",
                    "noscript"
                ];

                // Get classes added by editor
                var pluginClasses = window.plugin_classes_list.split("|");

                for(var x = 0; x < pluginClasses.length; x++){
                    pluginClasses[x] = "." + pluginClasses[x];
                }

                // concat
                notSelectors = notSelectors.concat(pluginClasses);

                // Adding not selectors
                for(var i = 0; i < notSelectors.length; i++){
                    selector += ":not("+notSelectors[i]+")";
                }

                // parement
                if(custom !== undefined){
                    selector += custom;
                }

                // Visible filter
                selector += ":visible";

                return selector;

            }


            /* ---------------------------------------------------- */
            /* Option None / Disable Buttons                        */
            /* ---------------------------------------------------- */
            /*
                  none and disable button api.
            */
            $(".yp-btn-action").click(function(e) {

                var elementPP = $(this).parent().parent().parent();

                var id = get_option_id(elementPP);

                var value,prefix;

                // inherit, none etc.
                if ($(this).hasClass("yp-none-btn")) {

                    if (elementPP.find(".yp-disable-btn.active").length >= 0) {
                        elementPP.find(".yp-disable-btn.active").trigger("click");

                        if (e.originalEvent) {
                            elementPP.addClass("reset-enable");
                        }

                    }

                    value = '';
                    prefix = '';

                    // If slider
                    if (elementPP.hasClass("yp-slider-option")) {

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Show
                            elementPP.find(".yp-after").show();

                            // Is Enable
                            elementPP.find(".yp-after-disable-disable").hide();

                            // Value
                            value = $("#yp-" + id).val();
                            prefix = $("#" + id + "-after").val();

                        } else {

                            $(this).addClass("active");

                            // Hide
                            elementPP.find(".yp-after").hide();

                            // Is Disable
                            elementPP.find(".yp-after-disable-disable").show();

                            // Value
                            value = elementPP.find(".yp-none-btn").text();

                        }

                        // If is radio
                    } else if (elementPP.find(".yp-radio-content").length > 0) {

                        

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            value = $("input[name=" + id + "]:checked").val();

                            $("input[name=" + id + "]:checked").parent().addClass("active");

                        } else {

                            $(this).addClass("active");

                            elementPP.find(".yp-radio.active").removeClass("active");

                            // Value
                            value = elementPP.find(".yp-none-btn").text();

                        }

                        // If is select
                    } else if (elementPP.find("select").length > 0) {

                        

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            value = $("#yp-" + id).val();

                        } else {

                            $(this).addClass("active");

                            // Value
                            value = elementPP.find(".yp-none-btn").text();

                        }

                    } else {

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            value = $("#yp-" + id).val();

                        } else {

                            $(this).addClass("active");

                            // Value
                            value = 'transparent';

                        }

                    }

                    if (id == 'background-image') {

                        if (value.indexOf("//") != -1) {
                            value = "url(" + value + ")";
                        }

                        if (value == 'transparent') {
                            value = 'none';
                        }

                    }

                    if (e.originalEvent) {

                        insert_rule(null, id, value, prefix);
                        option_change();

                    } else if (id == 'background-repeat' || id == 'background-size') {

                        if ($(".yp_background_assets:visible").length > 0) {
                            insert_rule(null, id, value, prefix);
                            option_change();
                        }

                    }

                } else { // disable this option

                    value = '';
                    prefix = '';

                    // If slider
                    if (elementPP.hasClass("yp-slider-option")) {

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            if (!elementPP.find(".yp-none-btn").hasClass("active")) {
                                value = $("#yp-" + id).val();
                                prefix = $("#" + id + "-after").val();
                            } else {
                                value = elementPP.find(".yp-none-btn").text();
                            }

                        } else {

                            $(this).addClass("active");

                            // Value
                            value = 'disable';

                        }

                        // If is radio
                    } else if (elementPP.find(".yp-radio-content").length > 0) {

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            if (!elementPP.find(".yp-none-btn").hasClass("active")) {
                                value = $("input[name=" + id + "]:checked").val();
                            } else {
                                value = elementPP.find(".yp-none-btn").text();
                            }

                        } else {

                            $(this).addClass("active");

                            // Value
                            value = 'disable';

                        }

                        // If is select
                    } else if (elementPP.find("select").length > 0) {

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            if (!elementPP.find(".yp-none-btn").hasClass("active")) {
                                value = $("#yp-" + id).val();
                            } else {
                                value = elementPP.find(".yp-none-btn").text();
                            }

                        } else {

                            $(this).addClass("active");

                            // Value
                            value = 'disable';

                        }

                    } else {

                        if ($(this).hasClass("active")) {

                            $(this).removeClass("active");

                            // Value
                            if (!elementPP.find(".yp-none-btn").hasClass("active")) {
                                value = $("#yp-" + id).val();
                            } else {
                                value = elementPP.find(".yp-none-btn").text();
                            }

                        } else {

                            $(this).addClass("active");

                            // Value
                            value = 'disable';

                        }

                        if (id == 'background-image') {

                            if (value.indexOf("//") != -1) {
                                value = "url(" + value + ")";
                            }

                            if (value == 'transparent') {
                                value = 'none';
                            }

                        }

                    }


                    if (e.originalEvent) {
                        insert_rule(null, id, "disable", prefix);
                        set_default_value(id);
                        elementPP.removeClass("reset-enable");
                    }

                    if (e.originalEvent) {
                        option_change();
                    }

                }

                // Update panel
                gui_update();

            });

            /* ---------------------------------------------------- */
            /* Collapse List                                        */
            /* ---------------------------------------------------- */
            $(".yp-editor-list > li > h3").click(function() {

                if ($(this).parent().hasClass("yp-li-about") || $(this).parent().hasClass("yp-li-footer")) {
                    return '';
                }

                $(this).parent().addClass("current");

                // Disable.
                $(".yp-editor-list > li.active:not(.current)").each(function() {

                    $(".yp-editor-list > li").show(0);
                    $(this).find(".yp-this-content").hide(0).parent().removeClass("active");

                    $(".lock-btn").removeClass("active");

                });

                if ($(this).parent().hasClass("active")) {
                    $(this).parent().removeClass("active");
                } else {
                    $(this).parent().addClass("active");
                    $(".yp-editor-list > li:not(.active)").hide(0);
                }

                $(this).parent().find(".yp-this-content").toggle(0);
                $(this).parent().removeClass("current");

                if ($(".yp-close-btn.dashicons-menu").length > 0) {
                    $(".yp-close-btn").removeClass("dashicons-menu").addClass("dashicons-no-alt");
                    $(".yp-close-btn").tooltip('hide').attr('data-original-title', l18_close_editor).tooltip('fixTitle');
                }

                if ($(".yp-editor-list > li.active:not(.yp-li-about):not(.yp-li-footer) > h3").length > 0) {
                    $(".yp-close-btn").removeClass("dashicons-no-alt").addClass("dashicons-menu");
                    $(".yp-close-btn").tooltip('hide').attr('data-original-title', l18_back_to_menu).tooltip('fixTitle');

                }

                $('.yp-editor-list').scrollTop(0);

                gui_update();

            });

            /* ---------------------------------------------------- */
            /* Filters                                              */
            /* ---------------------------------------------------- */
            function number_filter(a) {
                if (typeof a !== "undefined" && a != '') {
                    if (a.replace(/[^\d.-]/g, '') === null || a.replace(/[^\d.-]/g, '') === undefined) {
                        return 0;
                    } else {
                        return a.replace(/[^\d.-]/g, '');
                    }
                } else {
                    return 0;
                }
            }

            function alfa_filter(a) {
                if (typeof a !== "undefined" && a != '') {
                    return a.replace(/\d/g, '').replace(".px", "px");
                } else {
                    return '';
                }
            }


            var get_basic_id = function(str) {
                if (typeof str !== "undefined" && str != '') {
                    str = str.replace(/\W+/g, "");
                    return str;
                } else {
                    return '';
                }
            };

            function get_id(str) {
                if (typeof str !== "undefined" && str != '') {

                    // \^\#\+\$\(\)\[\]\=\*\-\:\.\>\,\~ work in process. 
                    str = str.replace(/\:/g, "yp-sym-p")
                    .replace(/\^/g, "yp-sym-a")
                    .replace(/\#/g, "yp-sym-c")
                    .replace(/\+/g, "yp-sym-o")
                    .replace(/\$/g, "yp-sym-q")
                    .replace(/\(/g, "yp-sym-e")
                    .replace(/\)/g, "yp-sym-s")
                    .replace(/\[/g, "yp-sym-g")
                    .replace(/\]/g, "yp-sym-x")
                    .replace(/\=/g, "yp-sym-k")
                    .replace(/\*/g, "yp-sym-n")
                    .replace(/\-/g, "yp-sym-t")
                    .replace(/\./g, "yp-sym-u")
                    .replace(/\>/g, "yp-sym-l")
                    .replace(/\,/g, "yp-sym-b")
                    .replace(/\~/g, "yp-sym-m")
                    .replace(/[^a-zA-Z0-9_\^\#\+\$\(\)\[\]\=\*\-\:\.\>\,\~]/g, "");

                    return str;
                } else {
                    return '';
                }
            }

            function array_cleaner(actual) {

                var uniqueArray = actual.filter(function(item, pos) {
                    return actual.indexOf(item) == pos;
                });

                return uniqueArray;

            }


            function uppercase_first_letter(str){
                return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            }



            // Getting selected element's names
            function get_tag_information(selectors){

                var selectorsArray = selectors.split(",");

                // If is one selector
                if(selectorsArray.length == 1){
                    return get_single_tag_information(selectors);
                }


                // Multi Selectors
                var allTagNames = [];
                var name = '';

                // Get all tag names by selectors
                for(var i = 0; i < selectorsArray.length; i++){

                    // Get tag name
                    name = get_single_tag_information(selectorsArray[i]);

                    // Push if the name not in name-list
                    if(allTagNames.indexOf(name) == -1){
                        allTagNames.push(name);
                    }

                }

                return allTagNames.toString().replace(/\,/g,", ");

            }


            function get_foundable_query(selector,css,body,animation){

                if(css === true){

                    // Hover Focus active visited link
                    selector = selector.replace(/:hover/g,'').replace(/:focus/g,'').replace(/:active/g,'').replace(/:visited/g,'').replace(/:link/g,'');

                    // After
                    selector = selector.replace(/:after/g,'').replace(/::after/g,'');

                    // Before
                    selector = selector.replace(/:before/g,'').replace(/::before/g,'');

                    // First Letter
                    selector = selector.replace(/:first-letter/g,'').replace(/::first-letter/g,'');

                    // First Line
                    selector = selector.replace(/:first-line/g,'').replace(/::first-line/g,'');

                    // Selection
                    selector = selector.replace(/:selection/g,'').replace(/::selection/g,'');

                    // Be sure
                    if(selector.indexOf("::") != -1){
                        selector = selector.split("::")[0];
                    }

                    if(selector.indexOf(":") != -1){
                        selector = selector.split(":")[0];
                    }

                }

                if(body === true){

                    // YP Selector Hover
                    selector = selector.replace(/body\.yp-selector-hover/g,'').replace(/\.yp-selector-hover/g,'');

                    // YP Selector Focus
                    selector = selector.replace(/body\.yp-selector-focus/g,'').replace(/\.yp-selector-focus/g,'');

                    // YP Selector active
                    selector = selector.replace(/body\.yp-selector-active/g,'').replace(/\.yp-selector-active/g,'');

                    // YP Selector visited
                    selector = selector.replace(/body\.yp-selector-visited/g,'').replace(/\.yp-selector-visited/g,'');

                    // YP Selector link
                    selector = selector.replace(/body\.yp-selector-link/g,'').replace(/\.yp-selector-link/g,'');

                }

                if(animation === true){

                    // YP Animations
                    selector = selector.replace(/.yp_onscreen/g,'').replace(/.yp_focus/g,'').replace(/.yp_hover/g,'').replace(/.yp_click/g,'');

                }

                return selector.trim();

            }


            // No multiple spaces.
            function space_cleaner(data){
                return $.trim(data.replace(/\s\s+/g,' '));
            }



            /* ---------------------------------------------------- */
            /* Info About class or tagName                          */
            /* ---------------------------------------------------- */
            function get_single_tag_information(selector){

                selector = get_foundable_query(selector,true,true,true);

                if(iframe.find(selector).length <= 0){
                    return;
                }

                var PPname,Pname;

                // tagName
                var a = iframe.find(selector)[0].nodeName;

                // length
                var length = get_selector_array(selector).length - 1;

                // Names
                var n = get_selector_array(selector)[length].toUpperCase();
                if (n.indexOf(".") != -1){
                    n = n.split(".")[1].replace(/[^\w\s]/gi, '');
                }

                // Class Names
                var className = $.trim(get_selector_array(selector)[length]);
                if (className.indexOf(".") != -1) {
                    className = className.split(".")[1];
                }

                // ID
                var id = get_selected_element().attr("id");

                if (isDefined(id)) {
                    id = id.toUpperCase().replace(/[^\w\s]/gi, '');
                }

                // Parents 1
                if (length > 1) {
                    Pname = get_selector_array(selector)[length - 1].toUpperCase();
                    if (Pname.indexOf(".") != -1) {
                        Pname = Pname.split(".")[1].replace(/[^\w\s]/gi, '');
                    }
                } else {
                    Pname = '';
                }

                // Parents 2
                if (length > 2) {
                    PPname = get_selector_array(selector)[length - 2].toUpperCase();
                    if (PPname.indexOf(".") != -1) {
                        PPname = PPname.split(".")[1].replace(/[^\w\s]/gi, '');
                    }
                } else {
                    PPname = '';
                }

                // ID
                if (id == 'TOPBAR') {
                    return l18_topbar;
                } else if (id == 'HEADER') {
                    return l18_header;
                } else if (id == 'FOOTER') {
                    return l18_footer;
                } else if (id == 'CONTENT') {
                    return l18_content;
                }

                // Parrents Class
                if (PPname == 'LOGO' || PPname == 'SITETITLE' || Pname == 'LOGO' || Pname == 'SITETITLE') {
                    return l18_logo;
                } else if (n == 'MAPCANVAS') {
                    return l18_google_map;
                } else if (Pname == 'ENTRYTITLE' && a == 'A') {
                    return l18_entry_title_link;
                } else if (Pname == 'CATLINKS' && a == 'A') {
                    return l18_category_link;
                } else if (Pname == 'TAGSLINKS' && a == 'A') {
                    return l18_tag_link;
                }

                // Current Classes
                if (n == 'WIDGET') {
                    return l18_widget;
                } else if (n == 'FA' || get_selector_array(selector)[length].toUpperCase().indexOf("FA-") >= 0) {
                    return l18_font_awesome_icon;
                } else if (n == 'SUBMIT' && a == 'INPUT') {
                    return l18_submit_button;
                } else if (n == 'MENUITEM') {
                    return l18_menu_item;
                } else if (n == 'ENTRYMETA' || n == 'ENTRYMETABOX' || n == 'POSTMETABOX') {
                    return l18_post_meta_division;
                } else if (n == 'COMMENTREPLYTITLE') {
                    return l18_comment_reply_title;
                } else if (n == 'LOGGEDINAS') {
                    return l18_login_info;
                } else if (n == 'FORMALLOWEDTAGS') {
                    return l18_allowed_tags;
                } else if (n == 'LOGO') {
                    return l18_logo;
                } else if (n == 'ENTRYTITLE' || n == 'POSTTITLE') {
                    return l18_post_title;
                } else if (n == 'COMMENTFORM') {
                    return l18_comment_form;
                } else if (n == 'WIDGETTITLE') {
                    return l18_widget_title;
                } else if (n == 'TAGCLOUD') {
                    return l18_tag_cloud;
                } else if (n == 'ROW' || n == 'VCROW') {
                    return l18_row;
                } else if (n == 'BUTTON') {
                    return l18_button;
                } else if (n == 'BTN') {
                    return l18_button;
                } else if (n == 'LEAD') {
                    return l18_lead;
                } else if (n == 'WELL') {
                    return l18_well;
                } else if (n == 'ACCORDIONTOGGLE') {
                    return l18_accordion_toggle;
                } else if (n == 'PANELBODY') {
                    return l18_accordion_content;
                } else if (n == 'ALERT') {
                    return l18_alert_division;
                } else if (n == 'FOOTERCONTENT') {
                    return l18_footer_content;
                } else if (n == 'GLOBALSECTION' || n == 'VCSSECTION') {
                    return l18_global_section;
                } else if (n == 'MORELINK') {
                    return l18_show_more_link;
                } else if (n == 'CONTAINER' || n == 'WRAPPER') {
                    return l18_wrapper;
                } else if (n == 'DEFAULTTITLE') {
                    return l18_article_title;
                } else if (n == 'MENULINK' || n == 'MENUICON' || n == 'MENUBTN' || n == 'MENUBUTTON') {
                    return l18_menu_link;
                } else if (n == 'SUBMENU') {
                    return l18_submenu;

                    // Bootstrap Columns
                } else if (n.indexOf('COLMD1') != -1 || n == 'MEDIUM1' || n == 'LARGE1' || n == 'SMALL1') {
                    return l18_column + ' 1/12';
                } else if (n.indexOf('COLMD2') != -1 || n == 'MEDIUM2' || n == 'LARGE2' || n == 'SMALL2') {
                    return l18_column + ' 2/12';
                } else if (n.indexOf('COLMD3') != -1 || n == 'MEDIUM3' || n == 'LARGE3' || n == 'SMALL3') {
                    return l18_column + ' 3/12';
                } else if (n.indexOf('COLMD4') != -1 || n == 'MEDIUM4' || n == 'LARGE4' || n == 'SMALL4') {
                    return l18_column + ' 4/12';
                } else if (n.indexOf('COLMD5') != -1 || n == 'MEDIUM5' || n == 'LARGE5' || n == 'SMALL5') {
                    return l18_column + ' 5/12';
                } else if (n.indexOf('COLMD6') != -1 || n == 'MEDIUM6' || n == 'LARGE6' || n == 'SMALL6') {
                    return l18_column + ' 6/12';
                } else if (n.indexOf('COLMD7') != -1 || n == 'MEDIUM7' || n == 'LARGE7' || n == 'SMALL7') {
                    return l18_column + ' 7/12';
                } else if (n.indexOf('COLMD8') != -1 || n == 'MEDIUM8' || n == 'LARGE8' || n == 'SMALL8') {
                    return l18_column + ' 8/12';
                } else if (n.indexOf('COLMD9') != -1 || n == 'MEDIUM9' || n == 'LARGE9' || n == 'SMALL9') {
                    return l18_column + ' 9/12';
                } else if (n.indexOf('COLMD10') != -1 || n == 'MEDIUM10' || n == 'LARGE10' || n == 'SMALL10') {
                    return l18_column + ' 10/12';
                } else if (n.indexOf('COLMD11') != -1 || n == 'MEDIUM11' || n == 'LARGE11' || n == 'SMALL11') {
                    return l18_column + ' 11/12';
                } else if (n.indexOf('COLMD12') != -1 || n == 'MEDIUM12' || n == 'LARGE12' || n == 'SMALL12') {
                    return l18_column + ' 12/12';
                } else if (n.indexOf('COLXS1') != -1) {
                    return l18_column + ' 1/12';
                } else if (n.indexOf('COLXS2') != -1) {
                    return l18_column + ' 2/12';
                } else if (n.indexOf('COLXS3') != -1) {
                    return l18_column + ' 3/12';
                } else if (n.indexOf('COLXS4') != -1) {
                    return l18_column + ' 4/12';
                } else if (n.indexOf('COLXS5') != -1) {
                    return l18_column + ' 5/12';
                } else if (n.indexOf('COLXS6') != -1) {
                    return l18_column + ' 6/12';
                } else if (n.indexOf('COLXS7') != -1) {
                    return l18_column + ' 7/12';
                } else if (n.indexOf('COLXS8') != -1) {
                    return l18_column + ' 8/12';
                } else if (n.indexOf('COLXS9') != -1) {
                    return l18_column + ' 9/12';
                } else if (n.indexOf('COLXS10') != -1) {
                    return l18_column + ' 10/12';
                } else if (n.indexOf('COLXS11') != -1) {
                    return l18_column + ' 11/12';
                } else if (n.indexOf('COLXS12') != -1) {
                    return l18_column + ' 12/12';
                } else if (n.indexOf('COLSM1') != -1) {
                    return l18_column + ' 1/12';
                } else if (n.indexOf('COLSM2') != -1) {
                    return l18_column + ' 2/12';
                } else if (n.indexOf('COLSM3') != -1) {
                    return l18_column + ' 3/12';
                } else if (n.indexOf('COLSM4') != -1) {
                    return l18_column + ' 4/12';
                } else if (n.indexOf('COLSM5') != -1) {
                    return l18_column + ' 5/12';
                } else if (n.indexOf('COLSM6') != -1) {
                    return l18_column + ' 6/12';
                } else if (n.indexOf('COLSM7') != -1) {
                    return l18_column + ' 7/12';
                } else if (n.indexOf('COLSM8') != -1) {
                    return l18_column + ' 8/12';
                } else if (n.indexOf('COLSM9') != -1) {
                    return l18_column + ' 9/12';
                } else if (n.indexOf('COLSM10') != -1) {
                    return l18_column + ' 10/12';
                } else if (n.indexOf('COLSM11') != -1) {
                    return l18_column + ' 11/12';
                } else if (n.indexOf('COLSM12') != -1) {
                    return l18_column + ' 12/12';
                } else if (n.indexOf('COLLG1') != -1) {
                    return l18_column + ' 1/12';
                } else if (n.indexOf('COLLG2') != -1) {
                    return l18_column + ' 2/12';
                } else if (n.indexOf('COLLG3') != -1) {
                    return l18_column + ' 3/12';
                } else if (n.indexOf('COLLG4') != -1) {
                    return l18_column + ' 4/12';
                } else if (n.indexOf('COLLG5') != -1) {
                    return l18_column + ' 5/12';
                } else if (n.indexOf('COLLG6') != -1) {
                    return l18_column + ' 6/12';
                } else if (n.indexOf('COLLG7') != -1) {
                    return l18_column + ' 7/12';
                } else if (n.indexOf('COLLG8') != -1) {
                    return l18_column + ' 8/12';
                } else if (n.indexOf('COLLG9') != -1) {
                    return l18_column + ' 9/12';
                } else if (n.indexOf('COLLG10') != -1) {
                    return l18_column + ' 10/12';
                } else if (n.indexOf('COLLG11') != -1) {
                    return l18_column + ' 11/12';
                } else if (n.indexOf('COLLG12') != -1) {
                    return l18_column + ' 12/12';
                } else if (n == 'POSTBODY') {
                    return l18_post_division;
                } else if (n == 'POST') {
                    return l18_post_division;
                } else if (n == 'CONTENT' || n == 'DEFAULTCONTENT') {
                    return l18_content_division;
                } else if (n == 'ENTRYTITLE') {
                    return l18_entry_title;
                } else if (n == 'ENTRYCONTENT') {
                    return l18_entry_content;
                } else if (n == 'ENTRYFOOTER') {
                    return l18_entry_footer;
                } else if (n == 'ENTRYHEADER') {
                    return l18_entry_header;
                } else if (n == 'ENTRYTIME') {
                    return l18_entry_time;
                } else if (n == 'POSTEDITLINK') {
                    return l18_post_edit_link;
                } else if (n == 'POSTTHUMBNAIL') {
                    return l18_post_thumbnail;
                } else if (n == 'THUMBNAIL') {
                    return l18_thumbnail;
                } else if (n.indexOf("ATTACHMENT") >= 0) {
                    return l18_thumbnail_image;
                } else if (n == 'EDITLINK') {
                    return l18_edit_link;
                } else if (n == 'COMMENTSLINK') {
                    return l18_comments_link_division;
                } else if (n == 'SITEDESCRIPTION') {
                    return l18_site_description;
                } else if (n == 'POSTCLEAR' || n == 'POSTBREAK') {
                    return l18_post_break;
                }

                // Smart For ID
                if (get_name_by_classes(id) !== false) {
                    return get_name_by_classes(id);
                }

                // Smart For Class
                if (get_name_by_classes(className) !== false) {
                    return get_name_by_classes(className);
                }

                // If not have name found, use clear.
                if (n.indexOf("CLEARFIX") != -1 || n.indexOf("CLEARBOTH") != -1 || n == "CLEAR") {
                    return l18_clear;
                }

                // TAG NAME START
                if (a == 'P') {
                    return l18_paragraph;
                } else if (a == 'BR') {
                    return l18_line_break;
                } else if (a == 'HR') {
                    return l18_horizontal_rule;
                } else if (a == 'A') {
                    return l18_link;
                } else if (a == 'LI') {
                    return l18_list_item;
                } else if (a == 'UL') {
                    return l18_unorganized_list;
                } else if (a == 'OL') {
                    return l18_unorganized_list;
                } else if (a == 'IMG') {
                    return l18_image;
                } else if (a == 'B') {
                    return l18_bold_tag;
                } else if (a == 'I') {
                    return l18_italic_tag;
                } else if (a == 'STRONG') {
                    return l18_strong_tag;
                } else if (a == 'Em') {
                    return l18_italic_tag;
                } else if (a == 'BLOCKQUOTE') {
                    return l18_blockquote;
                } else if (a == 'PRE') {
                    return l18_preformatted;
                } else if (a == 'TABLE') {
                    return l18_table;
                } else if (a == 'TR') {
                    return l18_table_row;
                } else if (a == 'TD') {
                    return l18_table_data;
                } else if (a == 'HEADER' || n == 'HEADER') {
                    return l18_header_division;
                } else if (a == 'FOOTER' || n == 'FOOTER') {
                    return l18_footer_division;
                } else if (a == 'SECTION' || n == 'SECTION') {
                    return l18_section;
                } else if (a == 'FORM') {
                    return l18_form_division;
                } else if (a == 'BUTTON') {
                    return l18_button;
                } else if (a == 'CENTER') {
                    return l18_centred_block;
                } else if (a == 'DL') {
                    return l18_definition_list;
                } else if (a == 'DT') {
                    return l18_definition_term;
                } else if (a == 'DD') {
                    return l18_definition_description;
                } else if (a == 'H1') {
                    return l18_header + ' (' + l18_level + ' 1)';
                } else if (a == 'H2') {
                    return l18_header + ' (' + l18_level + ' 2)';
                } else if (a == 'H3') {
                    return l18_header + ' (' + l18_level + ' 3)';
                } else if (a == 'H4') {
                    return l18_header + ' (' + l18_level + ' 4)';
                } else if (a == 'H5') {
                    return l18_header + ' (' + l18_level + ' 5)';
                } else if (a == 'H6') {
                    return l18_header + ' (' + l18_level + ' 6)';
                } else if (a == 'SMALL') {
                    return l18_smaller_text;
                } else if (a == 'TEXTAREA') {
                    return l18_text_area;
                } else if (a == 'TBODY') {
                    return l18_body_of_table;
                } else if (a == 'THEAD') {
                    return l18_head_of_table;
                } else if (a == 'TFOOT') {
                    return l18_foot_of_table;
                } else if (a == 'U') {
                    return l18_underline_text;
                } else if (a == 'SPAN') {
                    return l18_span;
                } else if (a == 'Q') {
                    return l18_quotation;
                } else if (a == 'CITE') {
                    return l18_citation;
                } else if (a == 'CODE') {
                    return l18_expract_of_code;
                } else if (a == 'NAV' || n == 'NAVIGATION' || n == 'NAVIGATIONCONTENT') {
                    return l18_navigation;
                } else if (a == 'LABEL') {
                    return l18_label;
                } else if (a == 'TIME') {
                    return l18_time;
                } else if (a == 'DIV') {
                    return l18_division;
                } else if (a == 'CAPTION') {
                    return l18_caption_of_table;
                } else if (a == 'INPUT') {
                    return l18_input;
                } else {
                    return a.toLowerCase();
                }

            }

            function letter_repeat(str) {
                var reg = /^([a-z])\1+$/;
                var d = reg.test(str);
                return d;
            }

            function title_case(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            // http://www.corelangs.com/js/string/cap.html#sthash.vke6OlCk.dpuf

            function get_name_by_classes(className) {

                if (typeof className == typeof undefined || className === false) {
                    return false;
                }

                // RegExp
                var upperCase = new RegExp('[A-Z]');
                var numbers = new RegExp('[0-9]');
                var bottomRex = /_/;
                var topRex = /-/;

                // Only - or _
                if (bottomRex.test(className) && topRex.test(className)) {
                    return false;
                }

                // max 3 -
                if (topRex.test(className)) {
                    if (className.match(/-/g).length >= 3) {
                        return false;
                    }
                }

                // max 3 _
                if (bottomRex.test(className)) {
                    if (className.match(/_/g).length >= 3) {
                        return false;
                    }
                }

                // Clean
                className = className.replace(/_/g, ' ').replace(/-/g, ' ');

                var classNames = get_classes_array(className);

                var i = 0;
                for (i = 0; i < classNames.length; i++) {
                    if (classNames[i].length < 4 || classNames[i].length > 12) {
                        return false;
                    }
                }

                // if all lowerCase
                // if not any number
                // if minimum 3 and max 20
                if (className.match(upperCase) || className.match(numbers) || className.length < 5 || className.length > 20) {
                    return false;
                }

                if (letter_repeat(className)) {
                    return false;
                }

                // For id.
                className = className.replace("#", "");

                return title_case(className);

            }

            // disable jquery plugins. // Parallax.
            $("#yp-background-parallax .yp-radio").click(function() {

                var v = $(this).find("input").val();

                if (v == 'disable') {
                    iframe.find(get_current_selector()).addClass("yp-parallax-disabled");
                } else {
                    iframe.find(get_current_selector()).removeClass("yp-parallax-disabled");
                }

            });

            // Update saved btn
            function option_change(){

                if(window.option_changeType != 'auto'){
                    $(".yp-save-btn").html(l18_save).removeClass("yp-disabled").addClass("waiting-for-save");
                }

                setTimeout(function() {

                    // Call CSS Engine.
                    $(document).CallCSSEngine(get_clean_css(true));

                }, 200);

                setTimeout(function() {
                    editor.setValue(get_clean_css(true));
                }, 200);

                setTimeout(function(){
                    check_undoable_history();
                },220);

            }

            // Wait until CSS process.
            function process(close, id, type) {

                // close css editor with process..
                if (close === true) {

                    iframe.find(".yp-styles-area style[data-rule='a']").remove();

                    $("#cssData,#cssEditorBar,#leftAreaEditor").hide();
                    iframeBody.trigger("scroll");
                    mainBody.removeClass("yp-css-editor-active");

                    $(".css-editor-btn").attr("data-original-title",$(".css-editor-btn").attr("data-title"));

                    // Update All.
                    draw();

                }

                // IF not need to process, stop here.
                if (mainBody.hasClass("yp-need-to-process") === false || mainBody.hasClass("yp-processing-now")) {
                    return false;
                }

                // Remove class.
                body.removeClass("yp-need-to-process");

                // Processing.
                if (body.find(".yp-processing").length === 0) {
                    body.addClass("yp-processing-now");
                    body.append("<div class='yp-processing'><span></span><p>" + l18_process + "</p></div>");
                } else {
                    body.addClass("yp-processing-now");
                }

                if (editor.getValue().length > 800) {
                    body.find(".yp-processing").show();
                }

                setTimeout(function() {

                    css_to_data('desktop');

                    if (editor.getValue().toString().indexOf("@media") != -1) {

                        var mediaTotal = editor.getValue().toString().replace(/(\r\n|\n|\r)/g, "").match(/@media(.*?){/g);

                        // Search medias and convert to Yellow Pencil Data
                        $.each(mediaTotal, function(index, value) {

                            // make .min the media content
                            value = get_minimized_css(value,false);

                            css_to_data(value);

                        });

                    }

                    iframe.find("#yp-css-data-full").remove();

                    // Added from css_to_data function. must remove.
                    body.removeClass("process-by-code-editor");

                    setTimeout(function() {
                        body.removeClass("yp-processing-now");
                        body.find(".yp-processing").hide();

                        var oldData = editor.session.getUndoManager();
                        editor.setValue(get_clean_css(true));
                        editor.session.setUndoManager(oldData);

                    }, 5);

                    // Save
                    if (id !== false) {

                        var posting = $.post(ajaxurl, {
                            action: "yp_ajax_save",
                            yp_id: id,
                            yp_stype: type,
                            yp_data: get_clean_css(true),
                            yp_editor_data: get_editor_data()
                        });

                        $.post(ajaxurl, {

                                action: "yp_preview_data_save",
                                yp_data: data

                            });

                        // Done.
                        posting.complete(function(data) {
                            $(".yp-save-btn").html(l18_saved).addClass("yp-disabled").removeClass("waiting-for-save");
                        });

                    }

                    if(body.hasClass("yp-animate-manager-active")){
                        animation_manager();
                    }

                }, 50);

            }

            //Function to convert hex format to a rgb color
            function get_color(rgb) {
                if (typeof rgb !== 'undefined') {

                    if(rgb.indexOf("rgba") != -1){
                        return rgb.replace(/\s+/g,"");
                    }

                    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

                    return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';

                } else {
                    return '';
                }
            }


            // Long to short sorted for replacement.
            window.plugin_classes_list_sorted = window.plugin_classes_list.split("|").sort(function(a, b){return b.length - a.length;}).join("|");


            // Clean classes by yellow pencil control classes.
            function class_cleaner(data) {

                if (isUndefined(data)) {
                    return '';
                }

                return data.replace(new RegExp(window.plugin_classes_list_sorted,"gi"), '');
                
            }


            // there is a few play method and this func clear all animation timeout.
            function clear_animation_timer(){

                clearTimeout(window.animationTimer1);
                clearTimeout(window.animationTimer2);
                clearTimeout(window.animationTimer3);
                clearTimeout(window.animationTimer4);

            }


            // trigger end.
            function element_animation_end(){

                if(is_content_selected()){
                    get_selected_element().trigger("animationend webkitAnimationEnd oanimationend MSAnimationEnd");
                }

            }


            // This function add to class to body tag.
            // ex input: .element1 .element2
            // ex output: body.custom-class .element1 element2
            function add_class_to_body(selector, prefix) {

                var selectorOrginal = selector;

                // Basic
                if (selector == 'body') {
                    selector = selector + "." + prefix;
                }

                // If class added, return.
                if (selector.indexOf("body." + prefix) != -1) {
                    return selector;
                }

                var firstHTML = '';
                if (get_selector_array(selector).length > 0) {

                    var firstSelector = $.trim(get_selector_array(selector)[0]);

                    if (firstSelector.toLowerCase() == 'html') {
                        firstHTML = firstSelector;
                    }

                    if (iframe.find(firstSelector).length > 0) {
                        if (firstSelector.indexOf("#") != -1) {
                            if (iframe.find(firstSelector)[0].nodeName == 'HTML') {
                                firstHTML = firstSelector;
                            }
                        }

                        if (firstSelector.indexOf(".") != -1) {
                            if (iframe.find(firstSelector)[0].nodeName == 'HTML') {
                                firstHTML = firstSelector;
                            }
                        }
                    }

                    if (firstHTML != '') {
                        selector = get_selector_array(selector)[1];
                    }

                }

                // find body tag
                selector = selector.replace(/\bbody\./g, 'body.' + prefix + ".");
                selector = selector.replace(' body ', ' body.' + prefix + " ");

                // If class added, return.
                if (selector.indexOf("body." + prefix) != -1) {
                    if (firstHTML != '') {
                        selector = firstHTML + " " + selector;
                    }

                    return selector;
                }

                // Get all body classes.
                if (iframeBody.attr("class") !== undefined && iframeBody.attr("class") !== null) {

                    // Find element
                    var element = iframe.find(selectorOrginal);

                    if(element.length > 0){

                        if(element[0].nodeName == 'BODY'){

                            var bodyClasses = get_classes_array(iframeBody.attr("class"));

                            // Adding to next to classes.
                            for (var i = 0; i < bodyClasses.length; i++) {
                                selector = selector.replace("." + bodyClasses[i] + " ", "." + bodyClasses[i] + "." + prefix + " ");

                                if (get_selector_array(selector).length == 1 && bodyClasses[i] == selector.replace(".", "")) {
                                    selector = selector + "." + prefix;
                                }

                            }

                        }

                    }

                }

                // If class added, return.
                if (selector.indexOf("." + prefix + " ") != -1) {
                    if (firstHTML != '') {
                        selector = firstHTML + " " + selector;
                    }

                    return selector;
                }

                // If class added, return.
                if (selector.indexOf("." + prefix) != -1 && get_selector_array(selector).length == 1) {
                    if (firstHTML != '') {
                        selector = firstHTML + " " + selector;
                    }

                    return selector;
                }

                // Get body id.
                var bodyID = iframeBody.attr("id");

                selector = selector.replace("#" + bodyID + " ", "#" + bodyID + "." + prefix + " ");

                // If class added, return.
                if (selector.indexOf("." + prefix + " ") != -1) {
                    if (firstHTML != '') {
                        selector = firstHTML + " " + selector;
                    }

                    return selector;
                }

                selector = "YPIREFIX" + selector;
                selector = selector.replace(/YPIREFIXbody /g, 'body.' + prefix + " ");
                selector = selector.replace("YPIREFIX", "");

                // If class added, return.
                if (selector.indexOf("body." + prefix + " ") != -1) {
                    if (firstHTML != '') {
                        selector = firstHTML + " " + selector;
                    }

                    return selector;
                }

                if (selector.indexOf(" body ") == -1 || selector.indexOf(" body.") == -1) {
                    selector = "body." + prefix + " " + selector;
                }

                if (firstHTML != '') {
                    selector = firstHTML + " " + selector;
                }

                return selector;

            }

            // Browser fullscreen
            function toggle_fullscreen(elem) {
                // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
                    if (elem.requestFullScreen) {
                        elem.requestFullScreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullScreen) {
                        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                    body.addClass("yp-fullscreen");
                    setTimeout(function(){draw_responsive_handle();},250);
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    body.removeClass("yp-fullscreen");
                    setTimeout(function(){draw_responsive_handle();},250);
                }
            }

            $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
                var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                var event = state ? 'FullscreenOn' : 'FullscreenOff';

                if (event == 'FullscreenOff') {
                    $(".fullscreen-btn").removeClass("active");
                    body.removeClass("yp-fullscreen");
                }

                if (event == 'FullscreenOn') {
                    $(".fullscreen-btn").addClass("active");
                    body.addClass("yp-fullscreen");
                }

            });


            // Disable history shift mouse.
            mainDocument.keydown(function(e){

                var tag = e.target.tagName.toLowerCase();

                if(tag != 'input' && tag != 'textarea'){
                
                    if (e.shiftKey && (e.which == '61' || e.which == '107' || e.which == '173' || e.which == '109'  || e.which == '187'  || e.which == '189')){
                            e.preventDefault();
                    }

                }

            });

            mainDocument.bind('mousewheel DOMMouseScroll', function (e) {
                if (e.shiftKey) {
                   e.preventDefault();
                }
            });



        /* ---------------------------------------------------- */
        /* HTML EDITOR JAVASCRIPTS                              */
        /* ---------------------------------------------------- */
        if(is_html_mod()){

            // add body in iframe
            iframeBody.addClass("yp-html-mod-active");
        

            // Style Editor Click
            iframe.on("click", '.yp-edit-style', function() {
                toggle_style_editor();
            });

            // Hide Style Editor
            $(".yp-hide-style-editor").click(function(){
                toggle_style_editor();
            });

        }
        

        // Toggle Style Editor
        function toggle_style_editor(){

            // Stop if non html mod
            if(!is_html_mod()){return false;}

            iframeBody.toggleClass("yp-style-editor-active");
            mainBody.toggleClass("yp-style-editor-active");
            update_customizing_element();
            gui_update();
        }

        // Update Customizing Element Name
        function update_customizing_element(){

            // Stop if non html mod
            if(!is_html_mod()){return false;}

            var tag = get_tag_information(get_current_selector());
            var text = removeDiacritics(uppercase_first_letter(tag).replace(/\d+/g, '')) + " Element";
            $(".yp-li-about h3 div").html(text);
        }

        // Hide Style Editor On Leave
        function element_leave(){

            // Stop if non html mod
            if(!is_html_mod()){return false;}

            iframeBody.removeClass("yp-style-editor-active");
            mainBody.removeClass("yp-style-editor-active");
        }


        }; // Yellow Pencil main function.

}(jQuery));