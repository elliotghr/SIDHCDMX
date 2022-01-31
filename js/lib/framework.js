
$(document).ready(function(){$.extend({keys:function(obj){var a=[];$.each(obj,function(k){a.push(k)});return a;}});var Accessaudio=$('#Dif-access').find('audio')[0];$('#Dif-access').hover(function(){Accessaudio.play();},function(){Accessaudio.pause();Accessaudio.currentTime=0;});$('.Slider-events').owlCarousel({loop:true,margin:28,nav:true,onInitialized:function(){$('.Slider-events').parent().addClass('active');},navText:['<i class="fa fa-caret-left"></i>','<i class="fa fa-caret-right"></i>'],responsive:{0:{items:2},600:{items:4},1000:{items:6}}});$('.Slider-normal-b').owlCarousel({loop:true,margin:11,nav:true,autoplay:false,navText:['<i class="fa fa-chevron-circle-left"></i>','<i class="fa fa-chevron-circle-right"></i>'],responsive:{0:{items:1},600:{items:1},1000:{items:1}}});$('.Slider-thumbs').owlCarousel({loop:true,margin:28,nav:true,onInitialized:function(){$('.Slider-events').parent().addClass('active');},navText:['<i class="fa fa-caret-left"></i>','<i class="fa fa-caret-right"></i>'],responsive:{0:{items:1},600:{items:2},1000:{items:4}}});$('.Panel-gallery-carousel').owlCarousel({loop:true,margin:10,nav:true,dots:false,navText:['<button class="Button-border"><i class="fa fa-caret-left"></i></button>','<button class="Button-border"><i class="fa fa-caret-right"></i></button>'],responsive:{0:{items:1},600:{items:3},1000:{items:4}}});$('.Slider-simple').owlCarousel({loop:true,margin:10,nav:true,autoplay:true,autoplayTimeout:4000,autoplayHoverPause:true,navText:['<i class="fa fa-caret-left"></i>','<i class="fa fa-caret-right"></i>'],responsive:{0:{items:1},600:{items:1},1000:{items:1}}});$('.Slider-triple').owlCarousel({loop:true,margin:0,nav:false,responsive:{0:{items:1},600:{items:3},1000:{items:3}}});$('.Slider-double').owlCarousel({loop:true,margin:0,nav:true,navText:['<i class="fa fa-caret-left"></i>','<i class="fa fa-caret-right"></i>'],responsive:{0:{items:1},600:{items:2},1000:{items:2}}});$('.Slider-one').owlCarousel({loop:true,margin:0,nav:false,responsive:{0:{items:1},600:{items:1},1000:{items:1}}});$('.Events select').change(function(e){var sel=$(this).val();$('input[name="page"]').val(1);$(this).closest('form').submit();});$('.Notes select').change(function(e){var sel=$(this).val();$('input[name="page"]').val(1);$(this).closest('form').submit();});$('.HeaderNav-element.dropdown > a').click(function(e){e.preventDefault();var headelem=$(this).parent();if(headelem.hasClass('active')){headelem.removeClass('active');}else{headelem.addClass('active');}});$('.HeaderNav-mobile a').click(function(e){e.preventDefault();var ActBtn=$(this);var Btnss=$('.Mobile-actions');var Hnav=$(this).closest('.HeaderMenu').find('.HeaderNav');var Hfind=$(this).closest('.HeaderMenu').find('.Header-findbox');Hfind.find('input').focusout();if(Hnav.is(':visible')){Btnss.removeClass('Active');Hnav.slideUp('fast');}else{Btnss.removeClass('Active');Hfind.slideUp('fast');ActBtn.addClass('Active');Hnav.slideDown('fast');}});$('.Header-finder a').click(function(e){e.preventDefault();var ActBtn=$(this);var Btnss=$('.Mobile-actions');var Hnav=$(this).closest('.HeaderMenu').find('.HeaderNav');var Hfind=$(this).closest('.HeaderMenu').find('.Header-findbox');if(Hfind.is(':visible')){Btnss.removeClass('Active');Hfind.slideUp('fast');Hfind.find('input').focusout();}else{Btnss.removeClass('Active');Hnav.slideUp('fast');ActBtn.addClass('Active');Hfind.slideDown('fast');Hfind.find('input').focus();}});$(window).on('ajaxErrorMessage',function(event,message){event.preventDefault();alert('Ocurríó un error, por favor reportalo a soporte.cms@cdmx.gob.mx');});$('.Content').on('click','.Page, .Panel-pagination--prev, .Panel-pagination--next',function(event){event.preventDefault();var page=$(this).data('page');$('input[name="page"]').val(page);$('main').find('form').submit();$("html, body").animate({scrollTop:300},500);});$('.Gallery').on('click','.Page, .Panel-pagination--prev, .Panel-pagination--next',function(event){event.preventDefault();var page=$(this).data('page');$('input[name="page"]').val(page);$('.Gallery').find('form').submit();});$('.Content select[name=selectByCharge], .Content select[name=year], .Content select[name=month],.Content select[name=day]').change(function(e){e.preventDefault();if($(this).find("option:selected").val()==""){$('input[name="page"]').val(1);}
if($(this).find("option:selected").val()!=""){if($('input[name="page"]').val()!=1){$('input[name="page"]').val(1);}}
$('.Filter-double').find('form').submit();});$('#BackTop-action').click(function(e){e.preventDefault();$("html, body").animate({scrollTop:0},"slow");});$(document).scroll(function(){var winHeight=$(window).height();var numScroll=$(document).scrollTop();var numToStop=$(document).height()-$('footer').height()-winHeight;if(numScroll>winHeight){$('#BackTop').slideDown();if(numToStop<=numScroll){$('#BackTop').addClass('in');}else{$('#BackTop').removeClass('in');}}else{$('#BackTop').slideUp();}});$('body').on('click','.Alert-close',function(e){e.preventDefault();var dialog=$(this).closest($(this).attr('rel'));dialog.slideUp();setTimeout(function(){dialog.remove();},2000);});$(".Panel-file .Link-file a").click(function(e){if($(this).attr("rel")!=''){$.request('informes_reportes::onVisit',{data:{id:$(this).attr("rel")},success:function(){}})}});$("#level-4 .Slider-triple a").click(function(e){var data=$(this).data("rel").split("-");if($(this).attr("rel")!=''){$.request('onVisitBanner',{data:{id:data[1]},success:function(){}})}});if($(window).width()>991){$('#Sidebar-nav .Sidebar-action').click();}
$('.Container-Formbuilder').on('click','.Add-field-file',function(e){e.preventDefault();var index=$(this).parent().parent().find('.Files').find('.file-field').length+1;var input=$(this).parent().parent().find('.Files').find('.file-field')[0];var id=input.firstElementChild.id;var newinput='<div class="form-group file file-field"><input name="'+id+'[]'+'" type="file" data-placeholder="Carga aquí..." class="filestyle" id="'+id+'_'+index+'"><a href="#" class="Del-file"><i class="fa fa-times"></i></a></div>';$(this).parent().parent().find('.Files').append(newinput);$('#'+id+'_'+index+'').filestyle();});$('.Container-Formbuilder').on('click','.Del-file',function(e){e.preventDefault();$(this).closest('.file-field').remove();});$('.datepicker').datepicker({format:"yyyy/mm/dd",maxViewMode:2,language:"es",orientation:"bottom auto",autoclose:true,startView:2,defaultViewDate:{year:1981}});$('.Container-Formbuilder').on('ajaxUpdate',function(){$('.datepicker').datepicker({format:"yyyy/mm/dd",maxViewMode:2,language:"es",orientation:"bottom auto",autoclose:true,startView:2,defaultViewDate:{year:1981}});$('input[type=file]').filestyle();});if($(".Form-Builder").length>0){$(".Container-Formbuilder").on('click','.FormBuilder-Data button[type=submit]',function(e){e.preventDefault();$("#Form-Process").ajaxSubmit({beforeSubmit:function(){$("#Modal-Load").modal('show');$(".Form-field").removeClass('Er');$(".Form-field span.form-message").remove();},success:function(response){$("#Modal-Load").modal('hide');if(response.success){$('#Modal-Sended .Asunto-Text').text(response.data.asunto);$('#Modal-Sended .Email-Text').text(response.data.email);if(response.data.phone!=""){$('#Modal-Sended .Content-Phone').removeClass('hide');$('#Modal-Sended .Phone-Text').text(response.data.phone);}
$('#Modal-Sended').modal('show');}
else{if(!jQuery.isEmptyObject(response.errors)){$.each(response.errors,function(field,errors){var $formfield=$('[name='+field+']').parent().parent();$formfield.addClass('Er');$formfield.append('<span class="form-message">'+errors[0]+'</span>')});var keys=$.keys(response.errors);var field=$('[name='+keys[0]+']');field.focus();$("html, body").animate({scrollTop:field.parent().parent().offset().top},"slow");}else{if(response.error){$("#Modal-Failed .modal-title").text('Error');$("#Modal-Failed .modal-body").text(response.error);}
$("#Modal-Failed").modal('show');}}},error:function(e){$("#Modal-Failed").modal('show');}});return false;});$(".Container-Formbuilder").on('click','.Button-Atencion-Success, .Button-Formbuilder-Success',function(e){e.preventDefault();$('#Form-Process').resetForm();$('#Modal-Sended').modal('hide');setTimeout(function(){top.location.reload();},300);});$(".Button-Formbuilder-Success").click(function(e){e.preventDefault();$('#Form-Process').resetForm();$('#Modal-Sended').modal('hide');setTimeout(function(){top.location.reload();},300);});var hasanchor=window.location.href.split('#');if(hasanchor[1]!==''){setTimeout(function(){$('#tab-'+hasanchor[1]).click();},200);}
$(document).on('click','a[data-toggle="tab"]',function(e){var newhash=$(this).attr('id').replace('tab-','');document.location.hash=newhash;});}});function processRequest(response){$("#List-Errors").addClass("hide");$(".Form-field").removeClass('Er');$(".Form-field span.form-message").remove();if(!response.success){if(!jQuery.isEmptyObject(response.errors)){$.each(response.errors,function(field,errors){var $formfield=$('[name='+field+']').parent().parent();$formfield.addClass('Er');$formfield.append('<span class="form-message">'+errors[0]+'</span>')});var keys=$.keys(response.errors);var field=$('[name='+keys[0]+']');field.focus();$("html, body").animate({scrollTop:field.parent().parent().offset().top},"slow");}else{$("#List-Errors").removeClass("hide").text(response.message);}}}

if(window.jQuery===undefined){throw new Error('The jQuery library is not loaded. The OctoberCMS framework cannot be initialized.');}
if(window.jQuery.request!==undefined){throw new Error('The OctoberCMS framework is already loaded.');}
+function($){"use strict";var Request=function(element,handler,options){var $el=this.$el=$(element);this.options=options||{};if(handler===undefined){throw new Error('The request handler name is not specified.')}
if(!handler.match(/^(?:\w+\:{2})?on*/)){throw new Error('Invalid handler name. The correct handler name format is: "onEvent".')}
var $form=options.form?$(options.form):$el.closest('form'),$triggerEl=!!$form.length?$form:$el,context={handler:handler,options:options}
$el.trigger('ajaxSetup',[context])
var _event=jQuery.Event('oc.beforeRequest')
$triggerEl.trigger(_event,context)
if(_event.isDefaultPrevented())return
var loading=options.loading!==undefined?options.loading:null,isRedirect=options.redirect!==undefined&&options.redirect.length,useFlash=options.flash!==undefined,useFiles=options.files!==undefined
if(useFiles&&typeof FormData==='undefined'){console.warn('This browser does not support file uploads via FormData')
useFiles=false}
if($.type(loading)=='string'){loading=$(loading)}
var requestHeaders={'X-OCTOBER-REQUEST-HANDLER':handler,'X-OCTOBER-REQUEST-PARTIALS':this.extractPartials(options.update)}
if(useFlash){requestHeaders['X-OCTOBER-REQUEST-FLASH']=1}
var requestData,inputName,data={}
$.each($el.parents('[data-request-data]').toArray().reverse(),function extendRequest(){$.extend(data,paramToObj('data-request-data',$(this).data('request-data')))})
if($el.is(':input')&&!$form.length){inputName=$el.attr('name')
if(inputName!==undefined&&options.data[inputName]===undefined){options.data[inputName]=$el.val()}}
if(options.data!==undefined&&!$.isEmptyObject(options.data)){$.extend(data,options.data)}
if(useFiles){requestData=new FormData($form.length?$form.get(0):null)
if($el.is(':file')&&inputName){$.each($el.prop('files'),function(){requestData.append(inputName,this)})
delete data[inputName]}
$.each(data,function(key){requestData.append(key,this)})}
else{requestData=[$form.serialize(),$.param(data)].filter(Boolean).join('&')}
var requestOptions={url:window.location.href,crossDomain:false,context:context,headers:requestHeaders,success:function(data,textStatus,jqXHR){if(this.options.beforeUpdate.apply(this,[data,textStatus,jqXHR])===false)return
if(options.evalBeforeUpdate&&eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalBeforeUpdate+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')===false)return
var _event=jQuery.Event('ajaxBeforeUpdate')
$triggerEl.trigger(_event,[context,data,textStatus,jqXHR])
if(_event.isDefaultPrevented())return
if(useFlash&&data['X_OCTOBER_FLASH_MESSAGES']){$.each(data['X_OCTOBER_FLASH_MESSAGES'],function(type,message){requestOptions.handleFlashMessage(message,type)})}
var updatePromise=requestOptions.handleUpdateResponse(data,textStatus,jqXHR)
updatePromise.done(function(){$triggerEl.trigger('ajaxSuccess',[context,data,textStatus,jqXHR])
options.evalSuccess&&eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalSuccess+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')})
return updatePromise},error:function(jqXHR,textStatus,errorThrown){var errorMsg,updatePromise=$.Deferred()
if((window.ocUnloading!==undefined&&window.ocUnloading)||errorThrown=='abort')
return
isRedirect=false
options.redirect=null
if(jqXHR.status==406&&jqXHR.responseJSON){errorMsg=jqXHR.responseJSON['X_OCTOBER_ERROR_MESSAGE']
updatePromise=requestOptions.handleUpdateResponse(jqXHR.responseJSON,textStatus,jqXHR)}
else{errorMsg=jqXHR.responseText?jqXHR.responseText:jqXHR.statusText
updatePromise.resolve()}
updatePromise.done(function(){$el.data('error-message',errorMsg)
var _event=jQuery.Event('ajaxError')
$triggerEl.trigger(_event,[context,errorMsg,textStatus,jqXHR])
if(_event.isDefaultPrevented())return
if(options.evalError&&eval('(function($el, context, errorMsg, textStatus, jqXHR) {'+options.evalError+'}.call($el.get(0), $el, context, errorMsg, textStatus, jqXHR))')===false)
return
requestOptions.handleErrorMessage(errorMsg)})
return updatePromise},complete:function(data,textStatus,jqXHR){$triggerEl.trigger('ajaxComplete',[context,data,textStatus,jqXHR])
options.evalComplete&&eval('(function($el, context, data, textStatus, jqXHR) {'+options.evalComplete+'}.call($el.get(0), $el, context, data, textStatus, jqXHR))')},handleConfirmMessage:function(message){var _event=jQuery.Event('ajaxConfirmMessage')
_event.promise=$.Deferred()
if($(window).triggerHandler(_event,[message])!==undefined){_event.promise.done(function(){options.confirm=null
new Request(element,handler,options)})
return false}
if(_event.isDefaultPrevented())return
if(message)return confirm(message)},handleErrorMessage:function(message){var _event=jQuery.Event('ajaxErrorMessage')
$(window).trigger(_event,[message])
if(_event.isDefaultPrevented())return
if(message)alert(message)},handleValidationMessage:function(message,fields){$triggerEl.trigger('ajaxValidation',[context,message,fields])
var isFirstInvalidField=true
$.each(fields,function focusErrorField(fieldName,fieldMessages){fieldName=fieldName.replace(/\.(\w+)/g,'[$1]')
var fieldElement=$form.find('[name="'+fieldName+'"], [name="'+fieldName+'[]"], [name$="['+fieldName+']"], [name$="['+fieldName+'][]"]').filter(':enabled').first()
if(fieldElement.length>0){var _event=jQuery.Event('ajaxInvalidField')
$(window).trigger(_event,[fieldElement.get(0),fieldName,fieldMessages,isFirstInvalidField])
if(isFirstInvalidField){if(!_event.isDefaultPrevented())fieldElement.focus()
isFirstInvalidField=false}}})},handleFlashMessage:function(message,type){},handleRedirectResponse:function(url){window.location.href=url},handleUpdateResponse:function(data,textStatus,jqXHR){var updatePromise=$.Deferred().done(function(){for(var partial in data){var selector=(options.update[partial])?options.update[partial]:partial
if($.type(selector)=='string'&&selector.charAt(0)=='@'){$(selector.substring(1)).append(data[partial]).trigger('ajaxUpdate',[context,data,textStatus,jqXHR])}
else if($.type(selector)=='string'&&selector.charAt(0)=='^'){$(selector.substring(1)).prepend(data[partial]).trigger('ajaxUpdate',[context,data,textStatus,jqXHR])}
else{$(selector).trigger('ajaxBeforeReplace')
$(selector).html(data[partial]).trigger('ajaxUpdate',[context,data,textStatus,jqXHR])}}
setTimeout(function(){$(window).trigger('ajaxUpdateComplete',[context,data,textStatus,jqXHR]).trigger('resize')},0)})
if(data['X_OCTOBER_REDIRECT']){options.redirect=data['X_OCTOBER_REDIRECT']
isRedirect=true}
if(isRedirect){requestOptions.handleRedirectResponse(options.redirect)}
if(data['X_OCTOBER_ERROR_FIELDS']){requestOptions.handleValidationMessage(data['X_OCTOBER_ERROR_MESSAGE'],data['X_OCTOBER_ERROR_FIELDS'])}
if(data['X_OCTOBER_ASSETS']){assetManager.load(data['X_OCTOBER_ASSETS'],$.proxy(updatePromise.resolve,updatePromise))}
else{updatePromise.resolve()}
return updatePromise}}
if(useFiles){requestOptions.processData=requestOptions.contentType=false}
context.success=requestOptions.success
context.error=requestOptions.error
context.complete=requestOptions.complete
requestOptions=$.extend(requestOptions,options)
requestOptions.data=requestData
if(options.confirm&&!requestOptions.handleConfirmMessage(options.confirm)){return}
if(loading)loading.show()
$(window).trigger('ajaxBeforeSend',[context])
$el.trigger('ajaxPromise',[context])
return $.ajax(requestOptions).fail(function(jqXHR,textStatus,errorThrown){if(!isRedirect){$el.trigger('ajaxFail',[context,textStatus,jqXHR])}
if(loading)loading.hide()}).done(function(data,textStatus,jqXHR){if(!isRedirect){$el.trigger('ajaxDone',[context,data,textStatus,jqXHR])}
if(loading)loading.hide()}).always(function(dataOrXhr,textStatus,xhrOrError){$el.trigger('ajaxAlways',[context,dataOrXhr,textStatus,xhrOrError])})}
Request.DEFAULTS={update:{},type:'POST',beforeUpdate:function(data,textStatus,jqXHR){},evalBeforeUpdate:null,evalSuccess:null,evalError:null,evalComplete:null}
Request.prototype.extractPartials=function(update){var result=[]
for(var partial in update)
result.push(partial)
return result.join('&')}
var old=$.fn.request
$.fn.request=function(handler,option){var args=arguments
var $this=$(this).first()
var data={evalBeforeUpdate:$this.data('request-before-update'),evalSuccess:$this.data('request-success'),evalError:$this.data('request-error'),evalComplete:$this.data('request-complete'),confirm:$this.data('request-confirm'),redirect:$this.data('request-redirect'),loading:$this.data('request-loading'),flash:$this.data('request-flash'),files:$this.data('request-files'),form:$this.data('request-form'),update:paramToObj('data-request-update',$this.data('request-update')),data:paramToObj('data-request-data',$this.data('request-data'))}
if(!handler)handler=$this.data('request')
var options=$.extend(true,{},Request.DEFAULTS,data,typeof option=='object'&&option)
return new Request($this,handler,options)}
$.fn.request.Constructor=Request
$.request=function(handler,option){return $(document).request(handler,option)}
$.fn.request.noConflict=function(){$.fn.request=old
return this}
function paramToObj(name,value){if(value===undefined)value=''
if(typeof value=='object')return value
try{return JSON.parse(JSON.stringify(eval("({"+value+"})")))}
catch(e){throw new Error('Error parsing the '+name+' attribute value. '+e)}}
$(document).on('change','select[data-request], input[type=radio][data-request], input[type=checkbox][data-request], input[type=file][data-request]',function documentOnChange(){$(this).request()})
$(document).on('click','a[data-request], button[data-request], input[type=button][data-request], input[type=submit][data-request]',function documentOnClick(e){e.preventDefault()
$(this).request()
if($(this).is('[type=submit]'))
return false})
$(document).on('keydown','input[type=text][data-request], input[type=submit][data-request], input[type=password][data-request]',function documentOnKeydown(e){if(e.keyCode==13){if(this.dataTrackInputTimer!==undefined)
window.clearTimeout(this.dataTrackInputTimer)
$(this).request()
return false}})
$(document).on('input','input[data-request][data-track-input]',function documentOnKeyup(e){var
$el=$(this),lastValue=$el.data('oc.lastvalue')
if(!$el.is('[type=email],[type=number],[type=password],[type=search],[type=text]'))
return
if(lastValue!==undefined&&lastValue==this.value)
return
$el.data('oc.lastvalue',this.value)
if(this.dataTrackInputTimer!==undefined)
window.clearTimeout(this.dataTrackInputTimer)
var interval=$(this).data('track-input')
if(!interval)
interval=300
var self=this
this.dataTrackInputTimer=window.setTimeout(function(){$(self).request()},interval)})
$(document).on('submit','[data-request]',function documentOnSubmit(){$(this).request()
return false})
$(window).on('beforeunload',function documentOnBeforeUnload(){window.ocUnloading=true})
$(document).ready(function triggerRenderOnReady(){$(document).trigger('render')})
$(window).on('ajaxUpdateComplete',function triggerRenderOnAjaxUpdateComplete(){$(document).trigger('render')})
$.fn.render=function(callback){$(document).on('render',callback)}}(window.jQuery);

+function($){"use strict";if($.oc===undefined)
$.oc={}
var LOADER_CLASS='oc-loading';$(document).on('ajaxSetup','[data-request][data-request-flash]',function(event,context){context.options.handleErrorMessage=function(message){$.oc.flashMsg({text:message,class:'error'})}
context.options.handleFlashMessage=function(message,type){$.oc.flashMsg({text:message,class:type})}})
$(document).on('ajaxValidation','[data-request][data-request-validate]',function(event,context,errorMsg,fields){var $this=$(this).closest('form'),$container=$('[data-validate-error]',$this),messages=[],$field
$.each(fields,function(fieldName,fieldMessages){$field=$('[data-validate-for="'+fieldName+'"]',$this)
messages=$.merge(messages,fieldMessages)
if(!!$field.length){if(!$field.text().length||$field.data('emptyMode')==true){$field.data('emptyMode',true).text(fieldMessages.join(', '))}
$field.addClass('visible')}})
if(!!$container.length){$container=$('[data-validate-error]',$this)}
if(!!$container.length){var $oldMessages=$('[data-message]',$container)
$container.addClass('visible')
if(!!$oldMessages.length){var $clone=$oldMessages.first()
$.each(messages,function(key,message){$clone.clone().text(message).insertAfter($clone)})
$oldMessages.remove()}
else{$container.text(errorMsg)}}
$this.one('ajaxError',function(event){event.preventDefault()})})
$(document).on('ajaxPromise','[data-request][data-request-validate]',function(){var $this=$(this).closest('form')
$('[data-validate-for]',$this).removeClass('visible')
$('[data-validate-error]',$this).removeClass('visible')})
$(document).on('ajaxPromise','[data-request]',function(){var $target=$(this)
if($target.data('attach-loading')!==undefined){$target.addClass(LOADER_CLASS).prop('disabled',true)}
if($target.is('form')){$('[data-attach-loading]',$target).addClass(LOADER_CLASS).prop('disabled',true)}}).on('ajaxFail ajaxDone','[data-request]',function(){var $target=$(this)
if($target.data('attach-loading')!==undefined){$target.removeClass(LOADER_CLASS).prop('disabled',false)}
if($target.is('form')){$('[data-attach-loading]',$target).removeClass(LOADER_CLASS).prop('disabled',false)}})
var StripeLoadIndicator=function(){var self=this
this.counter=0
this.indicator=$('<div/>').addClass('stripe-loading-indicator loaded').append($('<div />').addClass('stripe')).append($('<div />').addClass('stripe-loaded'))
this.stripe=this.indicator.find('.stripe')
$(document).ready(function(){$(document.body).append(self.indicator)})}
StripeLoadIndicator.prototype.show=function(){this.counter++
this.stripe.after(this.stripe=this.stripe.clone()).remove()
if(this.counter>1){return}
this.indicator.removeClass('loaded')
$(document.body).addClass('oc-loading')}
StripeLoadIndicator.prototype.hide=function(force){this.counter--
if(force!==undefined&&force){this.counter=0}
if(this.counter<=0){this.indicator.addClass('loaded')
$(document.body).removeClass('oc-loading')}}
$.oc.stripeLoadIndicator=new StripeLoadIndicator()
$(document).on('ajaxPromise','[data-request]',function(event){event.stopPropagation()
$.oc.stripeLoadIndicator.show()
var $el=$(this)
$(window).one('ajaxUpdateComplete',function(){if($el.closest('html').length===0)
$.oc.stripeLoadIndicator.hide()})}).on('ajaxFail ajaxDone','[data-request]',function(event){event.stopPropagation()
$.oc.stripeLoadIndicator.hide()})
var FlashMessage=function(options,el){var
options=$.extend({},FlashMessage.DEFAULTS,options),$element=$(el)
$('body > p.flash-message').remove()
if($element.length==0){$element=$('<p />').addClass(options.class).html(options.text)}
$element.addClass('flash-message fade').attr('data-control',null).on('click','button',remove).on('click',remove).append('<button type="button" class="close" aria-hidden="true">&times;</button>')
$(document.body).append($element)
setTimeout(function(){$element.addClass('in')},100)
var timer=window.setTimeout(remove,options.interval*1000)
function removeElement(){$element.remove()}
function remove(){window.clearInterval(timer)
$element.removeClass('in')
$.support.transition&&$element.hasClass('fade')?$element.one($.support.transition.end,removeElement).emulateTransitionEnd(500):removeElement()}}
FlashMessage.DEFAULTS={class:'success',text:'Default text',interval:5}
if($.oc===undefined)
$.oc={}
$.oc.flashMsg=FlashMessage
$(document).render(function(){$('[data-control=flash-message]').each(function(){$.oc.flashMsg($(this).data(),this)})})}(window.jQuery);