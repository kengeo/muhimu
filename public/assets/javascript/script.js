


var onAddressRemove = '';

$(function(){

	$('.cart').sidr({
      name: 'cart-right',
      side: 'right',
      source: '#cart-content',
      renaming: false,
      onOpen: function(){
	      $('#cart-text').html('Close Cart');
      },
      onClose: function(){
	      $('#cart-text').html('View Cart');
      }
    });

	$('.chzn-select').chosen({no_results_text: 'No results matched'});

	$('.cover-heading').flowtype({
		fontRatio : 18
	});

	$('[name="buy"]').click(function(){
		$.post('/ajax/addtocart', {'marketplace_id': $('[name="marketplace_id"]').val()}).success(function(data){
				data = JSON.parse(data);
				$('#cart-items').html(data.success);
		});
	});

	// This identifies your website in the createToken call below
	Stripe.setPublishableKey('pk_test_TxXYTL4D2cy9eGR1p4yEg0rl');

	var stripeResponseHandler = function(status, response) {
      var $form = $('#payment-form');

      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
      } else {
        // token contains id, last4, and card type
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // and re-submit
        $form.get(0).submit();
      }
    };

	$('#payment-form').submit(function(event) {
	    var $form = $(this);

	    // Disable the submit button to prevent repeated clicks
	    $form.find('button').prop('disabled', true);

	    Stripe.card.createToken($form, stripeResponseHandler);

	    // Prevent the form from submitting with the default action
	    return false;
	  });

    // Account Settings

	$('[name="usertype"]').change(function(){
		var skills = [];
		$('#options-loading').show();
		$('#skills input:checked').each(function() {
	        skills.push(this.value);
	    });
		$.get('/ajax/options',
        	{'professions': $(this).val(), 'specialization': $('[name="specialization"]').val(), 'skills': skills},
            function(data, status){
	            data = JSON.parse(data);
	            $('#specialization select').html(data.specializations);
	            $('#specialization select').trigger('chosen:updated');
				$('#skills').html(data.skills);
				$('#options-loading').hide();
		 });

	});

	$("#btn-changepassword").click(function(){
		if ($('[name="newpassword"]').val() == $('[name="confirmpassword"]').val()) {
			$.post('/ajax/changepassword', {newpassword: $('[name="newpassword"]').val(),
				confirmpassword: $('[name="confirmpassword"]').val(),
				oldpassword: $('[name="oldpassword"]').val()})
			.success(function(data){
				data = JSON.parse(data);
				$('#password-section').find('input').val('');
				$('#pwd_msg').fadeIn();
				//$('#pwd_msg').html(data.1]);
				if (data.error){
					$('#pwd_msg').html(data.error);
					$('#pwd_msg').addClass('bg-danger');
					$('#pwd_msg').removeClass('bg-success');
				}else{
					$('#pwd_msg').html(data.success);
					$('#pwd_msg').removeClass('bg-danger');
					$('#pwd_msg').addClass('bg-success');
				}
			});
		} else {
			$('#pwd_msg').fadeIn();
			$('#pwd_msg').addClass('bg-danger');
			$('#pwd_msg').removeClass('bg-success');
			$('#pwd_msg').html("Your new password does not match.");
		}
	});



	onAddressRemove = function(el){
		$(el).parents('a.list-group-item').remove();
	};

	//suggested address clicked
	onAddressAdd = function(el){
		$selection = $(el).parent('a.list-group-item').children('input');
		data = $selection.val();
		//console.log(data);
		obj = jQuery.parseJSON(data);
		//console.log(obj);
		obj.addr = data;
		obj.country_text = $("#loc_country :selected").text();
		$('#save_addr').append(template(obj));
		$('#add-input-section input').val("");
		$(el).parent().parent().empty('.suggested');

	};

	//var statedata = {{json_encode($state_list)}};
	/*var states = new Bloodhound({
	  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
	  queryTokenizer: Bloodhound.tokenizers.whitespace,
	  // `states` is an array of state names defined in "The Basics"
	  local: $.map(statedata, function(state) { return { value: state }; })
	});

	// kicks off the loading/processing of `local` and `prefetch`
	states.initialize();

	var makeAutoComplete = function(){
		$('#loc_state').typeahead({
			  hint: true,
			  highlight: true,
			  minLength: 1
			},
			{
			  name: 'states',
			  displayKey: 'value',
			  // `ttAdapter` wraps the suggestion engine in an adapter that
			  // is compatible with the typeahead jQuery plugin
			  source: states.ttAdapter()
			});
	}


	$('#loc_country').change(function(e){
		$('#loc_state').typeahead('destroy');
		$('#loc_state').val('');
		if ( $(this).val() == "US"){
			makeAutoComplete();
		}else{

		}
	});

	makeAutoComplete();*/

	var template = Handlebars.compile($('#tmpl_save_addr').html());

	$('#btn-addaddr').click(function(){
		//User input address object
		data = {
			street: $('#loc_street').val().trim(),
			suite: $('#loc_suite').val().trim(),
			city: $('#loc_city').val().trim(),
			zip: $('#loc_zip').val().trim(),
			state: $('#loc_state').val().trim(),
			country: $('#loc_country').val().trim()
		}
		data.addr = JSON.stringify(data);

		data.country_text = $("#loc_country :selected").text();

		//---------------------Address Verification via Google Maps API-------------------//
		 street = data['street'].replace(/ /g, '+');
		 suite = data['suite'].toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    		return letter.toUpperCase();
				});
		 city = data['city'].replace(/ /g, '+');
		 zip = data['zip'].replace(/ /g, '+');
		 state = data['state'].replace(/ /g, '+');
		 country = data['country'].replace(/ /g, '+');
		 address = street +  "+" +  city + "+" + state + "+" + zip +  "+" +country;

		var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false";

		//clean up suggested div
		$('.suggested').empty();

		//retrieve response
		$.ajax({
        url: url,
            dataType: 'json',
            cache: false,
	        success: function (data) {
	        	suggested = '';
	             for (i = 0; i < data.results.length; i++) {
	            components =  data.results[i].address_components;
	          //  alert(data.results[i].formatted_address);
	            var street_num = '';
	            var street_name = '';
	            var city = '';
	            var state = '';
	            var country = '';
	            var zip = '';
	            var lat = '';
	            var lng = '';
				//console.log(data.status);
				//console.log(data.results[i]);
				if (data.status == 'OK') {
					//go through data results to retrive address info for each match
					$.each(data.results[i], function(index, value) {

		            	if (jQuery.type(value) === "object" || $.isArray(value)) {
			            	$.each(value, function(index2, value2){

			            		if(jQuery.type(value2) === "object" || $.isArray(value2)){
			            			$.each(value2, function(index3, val3) {

					            		if (val3 == 'street_number') { street_num = data.results[i][index][index2]['long_name'];}
					            		if (val3 == 'route') { street_name = data.results[i][index][index2]['long_name'];}
					            		if (val3 == 'sublocality_level_1,sublocality,political') { city = data.results[i][index][index2]['long_name'];}
					            		if (val3 == 'administrative_area_level_1,political') { state = data.results[i][index][index2]['long_name'];}
					            		if (val3 == 'country,political') {
					            			country = data.results[i][index][index2]['short_name'];
					            			country_long = data.results[i][index][index2]['long_name'];
					            		}
					            		if (val3 == 'postal_code') { zip = data.results[i][index][index2]['long_name'];}

		            					if (index3 == 'lat') { lat = data.results[i][index][index2]['lat'];}
		            					if (index3 == 'lng') { lng = data.results[i][index][index2]['lng'];}

			            			});
			            		}
			            	});
			            }
					});
					//match(es) address object
		           	var street = street_num + " " + street_name;
		            addr = {
		            	street: street,
						suite: suite,
						city: city,
						zip: zip,
						state: state,
						country: country,
						lat: lat,
						lng: lng
		            }
		            //List match(es) for user to select from
		           	if ($.isEmptyObject(suite)) {} else{suite = " " + suite;}
		           	suggested = suggested +  "<a class='list-group-item'><input type='hidden' name='temp_location[]' value='" + JSON.stringify(addr) + "' /><h4 class='list-group-item-heading'>"
		           						+ street_num + " " + street_name + suite + "</h4><p class='list-group-item-text'>"
		           						+ city + ", " + state + " " + zip + ", " + country_long
		           						+ "</p><span class='addr-add' onclick='onAddressAdd(this)'><span class='glyphicon glyphicon-ok-circle'></span> Select</span></a>";

				}//end if status code = OK
				else{
					suggested = 'No Matches found!';
				}

	        };
	        $('div.suggested').append('<h4>Suggested Address</h4>' + suggested);
	        },
	        error: function (e) {
	            //console.log(e.message);
	             $('div.suggested').append('<h4>Suggested Address</h4>' + 'No Matches Found');
	        }
		});


		//-----------------------------------------------------------//

		isvalid = ""; // valid check
		if ( true || isvalid)
		{
	      //$('div.list-group').append(template(data));
	    }

    	//$('#add-input-section input').val("");
	});

});