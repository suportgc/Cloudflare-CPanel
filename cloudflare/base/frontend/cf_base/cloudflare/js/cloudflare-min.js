var CloudFlare=function(){return CloudFlare.init()};CloudFlare.fn=CloudFlare.prototype={},CloudFlare.$=CF_jQuery,_.extend(CloudFlare,{ACTIVE_DOMAIN:null,reset_form:function(){this.VALID=[],this.CF_RECS={},this.NUM_RECS=0,this.REC_TEXT=[],this.WWW_DOM_INFO=[]},get_lang_string:function(a,b){var c=CF_LANG[a],b=b||{};if(c)try{return YAHOO.lang.substitute(c,b)}catch(d){}return""},display_error:function(a,b,c){$=CloudFlare.$;var d=$("#cloudflare-error");d.length>0?(html=CFT.error({type:a,header:b,message:c}),$(html).appendTo(d).delay(8e3).queue(function(){console.log($(this)),$(this).slideUp()})):alert(c)},showHelp:function(a){var b=CF_LANG.help[a]||"Error loading help message";if("DN"in window){var c;"CF"in window&&"lightbox"in window.CF?(c=window.CF.lightbox,c.cfg.contentString=b):(window.CF=window.CF||{},window.CF.lightbox=c=new DN.Lightbox({contentString:b,animate:!1,maxWidth:500})),c.show.call(c,this)}return!1},ajax:function(a,b,c,d){var a=a||{},d=d||{},b=b||{};_.extend(a,{cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",homedir:USER_HOME_DIR});var e=function(a,c){"undefined"==typeof this.xhr&&$(this).html('<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"),b.error&&"function"==typeof b.error&&b.error.apply(this,[a]),CloudFlare.display_error("error",CPANEL.lang.Error,CPANEL.lang.ajax_try_again+"<br>"+(c?c:""))};_.extend(d,{url:CPANEL.urls.json_api(),data:a,success:function(a,c,d){console.log(this);try{console.log(b);var f=$.parseJSON(a);if(console.log(f),f.cpanelresult.error||"error"==f.cpanelresult.data[0].result)throw"Error response: "+(f.cpanelresult.error||f.cpanelresult.data[0].msg||"");b.success&&"function"==typeof b.success&&b.success.apply(this,[f])}catch(g){console.log(g),msg=g.message||g||"",e.apply(this,[d,msg])}},error:e}),c&&(d.context=c,$(c).html('<div style="padding: 20px">'+CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+"</div>")),console.log(d),$.ajax(d)},init:function(){this.reset_form();var a=document.getElementById("USER_submit");return YAHOO.util.Event.addListener(a,"click",this.signup_to_cf),this.add_validation(),null!=this.ACTIVE_DOMAIN&&this.update_user_records_table(),CloudFlare.$(document).on("click",".toggle",function(){$target=$("#"+$(this).attr("data-target")),$target.removeClass("hide"),$(this).hasClass("show")?$target.show():$(this).hasClass("hide-only")?$target.hide():$target.toggle()}),this},signup_to_cf:function(){var a,b,c,d=YAHOO.util.Dom.get("USER_tos").checked;if(!d)return CloudFlare.display_error("error",CPANEL.lang.Error,"Please agree to the Terms of Service before continuing."),!1;var e={success:function(c){"success"==c.cpanelresult.data[0].result?(a=this.get_lang_string("signup_welcome"),b=this.get_lang_string("signup_info",{email:email}),YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CloudFlare.display_error("add_USER_status_bar","success",a,b),setTimeout("window.location.reload(true)",1e4)):(YAHOO.util.Dom.setStyle("add_USER_record_button","display","block"),124==c.cpanelresult.data[0].err_code?(YAHOO.util.Dom.setStyle("cf_pass_noshow","display","block"),YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CloudFlare.display_error("add_USER_status_bar","error",CPANEL.lang.Error,"This email is already signed up with CloudFlare. Please provide the user's CloudFlare password to continue.")):(YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CloudFlare.display_error("add_USER_status_bar","error",CPANEL.lang.Error,c.cpanelresult.data[0].msg.replace(/\\/g,""))))},error:function(){$("#add_USER_record_button").show(),$("#add_USER_record_status").html("")}};CloudFlare.ajax({cpanel_jsonapi_func:"user_create",user:YAHOO.util.Dom.get("USER_user").value,email:YAHOO.util.Dom.get("USER_email").value,password:YAHOO.util.Dom.get("USER_pass").value},e,$("#add_USER_status_bar")),$("#add_USER_record_button").hide(),c=CloudFlare.get_lang_string("creating_account"),$("#add_USER_record_status").html(CPANEL.icons.ajax+" "+c)},add_validation:function(){},update_zones:function(a,b,c,d){var e={success:function(){CloudFlare.update_user_records_rows([a])},error:function(){CloudFlare.update_user_records_table()}},f=[];for(key in this.CF_RECS)this.CF_RECS[key]&&f.push(key);var g={cpanel_jsonapi_func:"zone_set",zone_name:this.ACTIVE_DOMAIN,user_key:USER_ID,subdomains:f.join(","),cf_recs:YAHOO.lang.JSON.stringify(this.CF_RECS)};c&&(g.old_rec=c,g.old_line=d),CloudFlare.ajax(g,e,$("#status_bar_"+a)),YAHOO.util.Dom.get("cloudflare_table_edit_"+a).innerHTML='<div style="padding: 20px">'+CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+"</div>"},toggle_record_off:function(a,b,c){this.CF_RECS[b]=0,this.update_zones(a,"",b,c)},toggle_record_on:function(a,b,c){if(this.CF_ON_CLOUD_MESSAGE){var d=60,e="message",f="cf-toggle-on";$.cf.notify(this.CF_ON_CLOUD_MESSAGE,e,d,f)}this.CF_RECS[b]=c,this.update_zones(a,"_off")},is_domain_cf_powered:function(a){for(var b=!1,c=0,d=a.length;d>c;c++)if(a[c].type.match(/^(CNAME)$/)&&a[c].cloudflare){b=!0;break}return b},build_dnszone_cache:function(a){NUM_RECS=a.length;for(var b=this.get_lang_string("tooltip_zone_cf_on"),c=this.get_lang_string("tooltip_zone_cf_off"),d=0;d<a.length;d++)a[d].type.match(/^(CNAME)$/)&&(1==a[d].cloudflare?(this.CF_RECS[a[d].name]=a[d].line,this.REC_TEXT[d]=b):this.REC_TEXT[d]=c,a[d].name.match(/^(www\.)/)&&(this.WWW_DOM_INFO=[d,a[d].name,a[d].line]))},build_dnszone_table_markup:function(a){var b=this.ACTIVE_DOMAIN;return console.log(a),console.log(this),a.length<1?"":(this.build_dnszone_cache(a),html=CFT.zones({records:a}),this.NUM_RECS>0&&(zone_row=CFT.zone({cloudflare:this.is_domain_cf_powered(a),domain:b}),console.log(zone_row),$('tr[data-zone="'+b+'"').replaceWith(zone_row)),html)},update_user_records_rows:function(a,b){var c=this.ACTIVE_DOMAIN,d={success:function(d){CloudFlare.build_dnszone_cache(d.cpanelresult.data);for(var e=0,f=a.length;f>e;e++){var g=a[e],h=CFT.zone_record({type:"CNAME",rec_num:g,record:d.cpanelresult.data[g]});$("#info_row_"+g).html(h),new YAHOO.widget.Tooltip("tt_cf_enabled_"+g,{context:"cloudflare_table_edit_"+g,text:CloudFlare.REC_TEXT[g],showDelay:300})}CloudFlare.NUM_RECS>0&&(zone_row=CFT.zone({cloudflare:CloudFlare.is_domain_cf_powered(d.cpanelresult.data),domain:c}),console.log(zone_row),$('tr[data-zone="'+c+'"').replaceWith(zone_row)),b&&b();var i=YAHOO.util.Dom.getY("user_records_div");window.scrollTo(0,i)}};CloudFlare.ajax({cpanel_jsonapi_func:"fetchzone",domain:this.ACTIVE_DOMAIN},d,$("#user_records_div"));for(var e=0,f=a.length;f>e;e++){var g=a[e];$("#cloudflare_table_edit_"+g).html('<div style="padding: 20px">'+CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+"</div>")}},update_user_records_table:function(a){var b={success:function(b){console.log(b);var c=CloudFlare.build_dnszone_table_markup(b.cpanelresult.data);YAHOO.util.Dom.get("user_records_div").innerHTML='<a name="user_recs_'+this.ACTIVE_DOMAIN+'"></a>'+c;for(var d=0;d<CloudFlare.NUM_RECS;d++)new YAHOO.widget.Tooltip("tt_cf_enabled_"+d,{context:"cloudflare_table_edit_"+d,text:CloudFlare.REC_TEXT[d],showDelay:300});a&&a();var e=YAHOO.util.Dom.getY("user_records_div");window.scrollTo(0,e)}};CloudFlare.ajax({cpanel_jsonapi_func:"fetchzone",domain:this.ACTIVE_DOMAIN},b,$("#user_records_div"))},refresh_records:function(a){var b={success:function(b){CloudFlare.build_dnszone_cache(b.cpanelresult.data),console.log(a),a&&a()}};console.log(this.ACTIVE_DOMAIN),CloudFlare.ajax({cpanel_jsonapi_func:"fetchzone",domain:this.ACTIVE_DOMAIN},b,$("#user_records_div"))},push_all_off:function(){var a={success:function(a){console.log(a),CloudFlare.update_user_records_table()}},b=[];for(key in CloudFlare.CF_RECS)CloudFlare.CF_RECS[key]&&b.push(key+":"+CloudFlare.CF_RECS[key]);CloudFlare.ajax({cpanel_jsonapi_func:"zone_delete",zone_name:CloudFlare.ACTIVE_DOMAIN,user_key:USER_ID,subdomains:b.join(",")},a,$("#status_bar_0"))},toggle_www_on:function(a){this.reset_form(),this.ACTIVE_DOMAIN=a;var b=function(){CloudFlare.WWW_DOM_INFO[2]&&CloudFlare.toggle_record_on(CloudFlare.WWW_DOM_INFO[0],CloudFlare.WWW_DOM_INFO[1],CloudFlare.WWW_DOM_INFO[2])};return this.update_user_records_table(b),!1},toggle_all_off:function(a){return this.reset_form(),this.ACTIVE_DOMAIN=a,this.refresh_records(this.push_all_off),!1},enable_domain:function(a){return this.reset_form(),this.ACTIVE_DOMAIN=a,null==this.ACTIVE_DOMAIN?$("#add_record_and_zone_table").slideUp(CPANEL.JQUERY_ANIMATION_SPEED):($("#add_record_and_zone_table").slideDown(CPANEL.JQUERY_ANIMATION_SPEED),this.update_user_records_table()),!1},change_cf_accnt:function(){window.open("https://www.cloudflare.com/cloudflare-settings.html?z="+this.ACTIVE_DOMAIN,"_blank")},change_cf_setting:function(a,b,c){this.ACTIVE_DOMAIN=a;var d={success:function(){return CloudFlare.get_stats(a),!1}};return"SecurityLevelSetting"==c?c=YAHOO.util.Dom.get(c).value:"AlwaysOnline"==c?c=YAHOO.util.Dom.get(c).value:"AutomaticIPv6"==c?c=YAHOO.util.Dom.get(c).value:"CachingLevel"==c&&(c=YAHOO.util.Dom.get(c).value),CloudFlare.ajax({cpanel_jsonapi_func:"zone_edit_cf_setting",zone_name:this.ACTIVE_DOMAIN,user_email:USER_EMAIL,user_api_key:USER_API_KEY,v:c,a:b},d,$("#user_records_div")),!1},show_a_help:function(a,b){return $(".open-help").remove(),$("#module_row_a_"+a).html('<td colspan="7"><div style="padding: 20px" class="open-help">A type records cannot be directly routed though the CloudFlare network. Instead, click <a href="../zoneedit/advanced.html">here</a> and either switch the type of '+b+" to CNAME, or else make a new CNAME record pointing to "+b+"</div></td>"),!1},set_railgun:function(a,b){this.ACTIVE_DOMAIN=a;var c={success:function(){return CloudFlare.get_stats(a),!1}};tag=YAHOO.util.Dom.get(b).value;var d="set_railgun";return"remove"==tag&&(d="remove_railgun"),CloudFlare.ajax({cpanel_jsonapi_func:d,zone_name:this.ACTIVE_DOMAIN,user_email:USER_EMAIL,user_api_key:USER_API_KEY,tag:tag},c,$("#user_records_div")),!1},set_railgun_mode:function(a,b,c){this.ACTIVE_DOMAIN=a;var d={success:function(){return CloudFlare.get_stats(a),!1}};tag=YAHOO.util.Dom.get(b).value;var e="enabled";return"0"==YAHOO.util.Dom.get(c).value&&(e="disabled"),CloudFlare.ajax({cpanel_jsonapi_func:"set_railgun_mode",zone_name:this.ACTIVE_DOMAIN,user_email:USER_EMAIL,user_api_key:USER_API_KEY,tag:tag,mode:e},d,$("#user_records_div")),!1},load_zone_features:function(a,b){this.reset_form(),this.ACTIVE_DOMAIN=a;var c={success:function(c){if(html="","undefined"!=typeof c.cpanelresult.data[0].response.result){var d=c.cpanelresult.data[0].response.result,e=d.objs[0];html=CloudFlare[b](d,e,a)}$(this).html(html)}},d=[];for(key in this.CF_RECS)this.CF_RECS[key]&&d.push(key);return CloudFlare.ajax({cpanel_jsonapi_func:"zone_get_stats",zone_name:this.ACTIVE_DOMAIN,user_email:USER_EMAIL,user_api_key:USER_API_KEY},c,$("#user_records_div")),!1},get_performance:function(a,b,c){var d,e={success:function(a){console.log(a),d=null==a.cpanelresult.data[0].response.railgun_conn.obj?null:a.cpanelresult.data[0].response.railgun_conn.obj}};if(CloudFlare.ajax({cpanel_jsonapi_func:"get_active_railguns",zone_name:CloudFlare.ACTIVE_DOMAIN,user_email:USER_EMAIL,user_api_key:USER_API_KEY},e),html="","undefined"!=typeof data.cpanelresult.data[0].response.result){var a=data.cpanelresult.data[0].response.result,b=a.objs[0];html+=CFT.performance({stats:b,domain:c})}return html},get_stats:function(a,b,c){return CFT.statistics({stats:b,result:a,domain:c})},get_security:function(a,b,c){return CFT.security({stats:b,domain:c})}}),CloudFlare.$(function(){window.CF=new CloudFlare});