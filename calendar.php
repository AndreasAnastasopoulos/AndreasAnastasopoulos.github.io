<?php
function build_calendar($month, $year){
    // Array with days of week
    $daysOfWeek = array('Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο','Κυριακή');

    // First day of the month that is in the arguement of this function
    $firstDayOfMonth = mktime(0,0,0,$month,1,$year);

    // Number of days this Month contains
    $numberDays = date('t',$firstDayOfMonth);

    // Info about the first day of this month
    $dateComponents = getdate($firstDayOfMonth);

    // Name of this month
    $monthName = $dateComponents['month'];

    // Index value 0-6 of the first day of this month
    $dayOfWeek = $dateComponents['wday'];

    // Current date
    $dateToday = date('Y-m-d');

    // Creating the HTML table
    $calendar = "table class='table table-bordered'>";
    $calendar.="<center><h2>$monthName $year</h2></center>";

    $calendar.="<tr>";

    // Creating the calendar headers
    foreach($daysOfWeek as $day){
        $calendar.= "<th class='header'>$day</th>";
    }

    $calendar = "</tr><tr>";

    if($dayOfWeek > 0){
        for($k=0;$k<$dayOfWeek;$k++){
            $calendar.="<td></td>";
        }
    }

    // Initiating the day counter
    $currentDay = 1;

    // Getting the month number
    $month = str_pad($month, 2, "0", STR_PAD_LEFT);

    while($currentDay <= $numberDays){

        // if seventh column (sunday) reached, start a new row
        if($dayOfWeek == 7){
            $dayOfWeek = 0;
            $calendar.= "<tr></tr>";
        } 

        $currentDayRel = str_pad($currentDay, 2, "0", STR_PAD_LEFT);
        $date = "$year-$month-$currentDayRel";

        $calendar.="<td><h4>$currentDay</h4>";

        $calendar.="</td>";

        $currentDay++;
        $dayOfWeek++;
    }

    // Completing the row of the last week in month, if necessary
    if($dayOfWeek != 7){
        $remainingDays = 7-$dayOfWeek;
        for($i=0;$i<$remainingDays;$i++){
            $calendar.="<td></td>";
        }
    }

    $calendar.="</tr>";
    $calendar.="</table>";

    echo $calendar;
}
?>

<!--<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                
                    //$dateComponents = getdate();
                    //$month = $dateComponents['mon'];
                    //$year = $dateComponents['year'];
                    //echo build_calendar($month, $year);
                    
            </div>
        </div> 
    </div>
</body>
</html> 