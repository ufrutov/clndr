$(document).ready(function() {
	
	var events = [];
	var fn = function (startDate, endDate, interval) {
		interval = interval || 1;

		var retVal = [],
			current = new Date(startDate),
			inter1 = moment( "02/03/2015" ).recur().every(4).days(),
			inter2 = moment( "02/04/2015" ).recur().every(4).days();

		while ( current <= endDate ) {
			if( inter1.matches( current ) || inter2.matches( current )  ) {
				retVal.push({
					title: moment(current).format("dddd") + '<span>'+moment(current).format("D/MM/YYYY")+'</span>',
					start: new Date(current),
					className: 'work',
					allDay: true
				});
			}
			current = new Date(current.setDate(current.getDate()+interval));
		}
		return retVal;
	}

	var d = fn(moment( "01/01/2015" ), moment( "12/31/2015" ), 1)

	$('#clndr').fullCalendar({
		events : d,
		firstDay: 1,
	    eventColor: '#378006',
	    eventClick: function(date, jsEvent, view) {
	    	var id = (date.id == undefined) ? null : date.id;
	    	if( id != null ) {
				console.log(date);
				$('.edit').show(function() {
					var id = (date.id == undefined) ? null : date.id;
					$('.note-input input').val(date.title);

					if( id == null ) {
						$('#delete').hide();
					} else
						$('#delete').attr('data-id', id);

					setTimeout(function() {
						$('.edit').hide();
					}, 10000);
				});
				$('#delete').click(function(e) {
					e.stopImmediatePropagation();
					e.preventDefault();
					var id = $('#delete').attr('data-id');
					if( id != null ) {
						$.ajax({
							url: url + 'db/index.php',
							data: {
								action: 'delete_date',
								id: id
							},
							type: 'post',
							success: function(output) {
								var data = $.parseJSON(output);
								console.log('success', data);
								$.each(events, function(i, v) {
									console.log(v);
									if(v.id == data.id)
										$('#clndr').fullCalendar( 'removeEventSource', v)
								});
								// $('#clndr').fullCalendar('addEventSource', array);
							}
						});
					}
				});
			}
		}
	});

	var url = window.location.href;
	$.ajax({
		url: url + 'db/index.php',
		data: {
			action: 'get_date'
		},
		type: 'post',
		success: function(output) {
			var data = $.parseJSON(output),
				array = [];
			$.each(data, function(i, v){
				array.push({
					title: v.note + '<span>('+v.title+' | '+moment(new Date(v.date)).format("D/MM")+')</span>',
					start: new Date(v.date),
					className: v.title.toLowerCase(),
					allDay: true,
					id: v.id
				});
			});
			$('#clndr').fullCalendar('addEventSource', array);
			events = array;
		}
	});

	var add_date = function() {
		console.log('add_date');
	}

	var reset = function() {
		$('.dropdown').find('i').html('Type');
		$('#note').val('');
		$('#date-list').html('');
	}

	$('.fc-add-button').click(function() {
		var new_dt = [];
		$('.modal').show(function() {
			$('#add-clndr').fullCalendar({
				events: events,
				firstDay: 1,
				dayClick: function(date, jsEvent, view) {
					var dt = date.format("D/MM/YYYY");
					new_dt.push(date);
					$('#date-list').append('<li class="btn btn-default date"><i>'+dt+'</i><span></span></li>');
				}
			});
		});

		$('.modal').click(function(e) {
			if(e.target == e.currentTarget)
				$('.modal').hide();
		});

		$('.dropdown-menu a').click(function(e) {
			var value = $(e.target).html();
			$('.dropdown').find('i').html(value);
			$('.dropdown').removeClass('open');
			return false;
		});

		$('#add-date').click(function() {
			var	dtar = [],
				note = $('#note').val(),
				type = $('#type i').html(),
				cls = (type == 'Type') ? 'Event' : type;
			if(note.length != 0 && new_dt.length != 0) {
				
				$.each(new_dt, function(i, v) {
					$.ajax({
						url: url + 'db/index.php',
						data: {
							action: 'add_date',
							note: note,
							title: cls,
							date: v.format("MM/D/YYYY")
						},
						type: 'post',
						success: function(output) {
							var data = $.parseJSON(output);
							$('#add-clndr').fullCalendar('addEventSource', [{
								title: data.note + '<span>('+data.title+' | '+moment(new Date(data.date)).format("D/MM")+')</span>',
								start: new Date(data.date),
								className: data.title.toLowerCase(),
								allDay: true,
								id: data.id
							}]);
						},
						failure: function(response) {
							console.log('failure', response);
						}
					});
				});
			}
		});

		$('#reset').click(function(e) {
			reset();
		});

	});



});