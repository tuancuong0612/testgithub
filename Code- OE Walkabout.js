function Create2DArray(rows) 
{
    var arr = [];
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }
    return arr;
}

function countElement(array,string)
{
    var count=0;
    for (var i=0;i<array.length;i++)
    {
        if (array[i]==string)
        {
            count++;
        }
    }
    return count;
}

function test_filter() //lấy điểm đầu của chuỗi data
{
  var sheet= SpreadsheetApp.getActiveSpreadsheet();
  var datasheet= sheet.getSheetByName("Sheet4");
  var emailsheet= sheet.getSheetByName("Sheet5");
  var originaldata= datasheet.getRange(1,1,datasheet.getLastRow()-1,5).getValues();
  var emaildata= emailsheet.getRange(1,1,emailsheet.getLastRow()-1,2).getValues();
  var contentdata= emailsheet.getRange(2,4,emailsheet.getLastRow()-1,1).getValues();
  var now= new Date('mm/dd/yyyy HH:mm');
  var time = new Date(now.getTime());
  timezone = "GMT+7" + new Date().getTimezoneOffset()/60
  var date = Utilities.formatDate(new Date(),"GMT+7", "yy-MM-dd");
  //Logger.log(datasheet.getLastRow());
  
  for (var i=0;i<9;i++)
  {
    originaldata[i][0]= Utilities.formatDate(originaldata[i][0], "GMT+7", "yy-MM-dd");
    var gap_day= [date.slice(6,8)-originaldata[i][0].slice(6,8)];
    var gap_month= [date.slice(3,5)-originaldata[i][0].slice(3,5)];
    if (gap_month>=1)
    {
      var intial_value= i;
      break;
    }
    else if (gap_day >=20)
    {
      var initial_value= i;
      break;
    }
  }
  
  var fixed_data=[];
  for (var i=initial_value; i<9;i++)
    {

        {
          fixed_data.push(originaldata[i][1]);
          //Logger.log(fixed_data);
        }
    }
  for (var i = 0;i<fixed_data.length;i++)
    {
        var count= countElement(fixed_data,fixed_data[i]);
        fixed_data.sort();
        if(count>1)
        {
            fixed_data.splice(i,count-1);
        }
    }
    var final_list=[];
    for (var j=0;j<5;j++)
    {       
      Logger.log(emaildata[j]);
        if (countElement(fixed_data,emaildata[j])<1)
        {
            final_list.push(emaildata[j]);
        }
    }
    Logger.log(final_list);
    return final_list
}



function createRemindTimeDrivenTriggers() 
{
    // Trigger every 6 hours.
    ScriptApp.newTrigger('sendRemindEmail')
        .timeBased()
        .onWeekDay(ScriptApp.WeekDay.THURSDAY)
        .create();
}


function sendRemindEmail()
{
    var send_list= test_filter();
  for (i=0;i<send_list.length;i++)
  {
     MailApp.sendEmail(send_list[i][0],"Dear "+ send_list[i][1] + "\n\n" + contentdata[0]+ "\n"+contentdata[1]+"\n\n"+contentdata[2]+"\n"+contentdata[3]);
  }
}



function createResultTimeDrivenTrigger()
{
      // Trigger every 6 hours.
      ScriptApp.newTrigger('sendResultEmail')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .create();
}

function sendResultEmail()
{
    var send_list= test_filter();
  for (i=0;i<send_list.length;i++)
  {
     MailApp.sendEmail(send_list[i][0],"Dear "+ send_list[i][1] + "\n\n" + contentdata[0]+ "\n"+contentdata[1]+"\n\n"+contentdata[2]+"\n"+contentdata[3]);
  }
}