<?php

	// Check if is set action request
	if(isset($_POST['action']) && !empty($_POST['action'])) {
		
		$db = new PDO('sqlite:db.sqlite');
		
		if( $db == null ) {
			echo 'fail';
			die;
		} else {
			$action = $_POST['action'];
	    	switch($action) {
		        case 'get_date':
		        	get_date($db);
		        	break;
		        case 'add_date':
		        	add_date($db);
		        	break;
		        case 'delete_date':
		        	delete_date($db);
		        	break;
		    }
		}
	}

	// Get full list of available date from data base
	function get_date($db) {
		
		$result = $db->prepare('SELECT * FROM date ORDER BY id ASC');
		$result->execute();
		$output = json_encode($result->fetchAll(PDO::FETCH_ASSOC));
		echo $output;

	}

	// Insert new date to the data base
	function add_date($db) {
		$note = isset($_POST['note']) ? $_POST['note'] : null;
		$title = isset($_POST['title']) ? $_POST['title'] : 0;
		$date = isset($_POST['date']) ? $_POST['date'] : 0;

		$result = $db->prepare('INSERT INTO date (note, title, date) VALUES (?, ?, ?)');
		$result->execute(array($note, $title, $date));

		echo json_encode(array('note' => $note, 'title' => $title, 'date' => $date, 'id' => $db->lastInsertId()));
	}

	function delete_date($db) {
		$id = isset($_POST['id']) ? $_POST['id'] : null;

		$result = $db->prepare('DELETE FROM date WHERE id='.$id.'');
		$result->execute();
		$output = json_encode(array('id' => $id));

		echo $output;
	}
?>