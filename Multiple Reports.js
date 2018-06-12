function main() {
  var REPORT_NAME = ['Domo Keyword Report Last 30 2', 'Domo Video Report Last 30 2', 'Domo Ad Report Last 30 2']   // Change this for each report
    //column names are as follows: keyword performance report, video performance report, ad performance report; note that some columns from your requirement does not support zero impressions
  var COLUMN_NAMES = ["QualityScore, AllConversionRate, AllConversions, AllConversionValue, Device, AccountDescriptiveName, AdGroupId, AdGroupName, CampaignId, CampaignName, CampaignStatus, Clicks, ConversionRate, Conversions, ConversionValue, Cost, Impressions, CustomerDescriptiveName, Date",
                   	
                   	"AdGroupId, AdGroupName, CampaignId, CampaignName, VideoChannelId, VideoDuration, VideoTitle, VideoQuartile100Rate, VideoQuartile25Rate, VideoQuartile50Rate, VideoQuartile75Rate, VideoTitle, VideoViewRate, VideoViews, ViewThroughConversions",                     
                      "AdGroupName, AdType, CampaignName, CreativeDestinationUrl, CriterionId, CriterionType, Date, Description, Description1, Description2, DevicePreference, DisplayUrl, Headline, HeadlinePart1, HeadlinePart2"
                     ]  
  var REPORT_TYPE = ["KEYWORDS_PERFORMANCE_REPORT", "VIDEO_PERFORMANCE_REPORT", "AD_PERFORMANCE_REPORT"];  // select the report type from here: https://developers.google.com/adwords/api/docs/appendix/reports?hl=en
  
  var i = 0;
  while(i<REPORT_NAME.length){ //looping to create/check files on your drive 
    if(DriveApp.getFilesByName(REPORT_NAME[i]).hasNext()){
      Logger.log("File found"); 
      var existingReport = DriveApp.getFilesByName(REPORT_NAME[i]).next(); 
      var spreadSheet = SpreadsheetApp.openByUrl(existingReport.getUrl());
      report(REPORT_NAME[i],spreadSheet,COLUMN_NAMES[i],REPORT_TYPE[i]); //calls function report
    } 
    else {
      Logger.log("File not found. Creating new file"); 
      var spreadSheet = SpreadsheetApp.create(REPORT_NAME[i]); 
      Logger.log("New file created");
      report(REPORT_NAME[i],spreadSheet,COLUMN_NAMES[i],REPORT_TYPE[i]); //calls function report
    } 
    i++;
  }
}

//this function creates the report by using report name, column name, and report type passed by the call on the main function
//exports report on sheet, creating sheet per account
function report(REPORT_NAME,spreadSheet,COLUMN_NAMES,REPORT_TYPE){
  var ACCOUNT = ['463-431-6322']; // comma delimited, single quoted list of account ids from Adwords (not the account names)
  var FILTER = "Impressions > 0"; 
  var DATE_RANGE = "LAST_30_DAYS"; 
  var column = COLUMN_NAMES.split(","); 
   
  var accountIterator = MccApp.accounts().withIds(ACCOUNT).get();; 
  while (accountIterator.hasNext()) { 
    var account = accountIterator.next();    
    MccApp.select(account); 
    
    var mccSheet = spreadSheet.getActiveSheet();
    mccSheet.setName(account.getName()); //renames active sheet to account name
    mccSheet.clear(); 
    mccSheet.appendRow(column); 
    var adwordsSheet = spreadSheet.insertSheet();

    Logger.log("Checking for existing file");
    
    Logger.log("Querying data for " + account.getName()); 
    
    var REPORT = AdWordsApp.report(
      'SELECT ' + COLUMN_NAMES + 
      ' FROM ' + REPORT_TYPE + 
      ' WHERE ' + FILTER + ' DURING ' + DATE_RANGE
    ); 

    REPORT.exportToSheet(adwordsSheet); 
    adwordsSheet.deleteRow(1); 
    var rowNumber = adwordsSheet.getLastRow();   
    var rangeToCopy = adwordsSheet.getDataRange(); 
    mccSheet.insertRowAfter(mccSheet.getLastRow());
    rangeToCopy.copyTo(mccSheet.getRange(mccSheet.getLastRow() + 1, 1)); 
    Logger.log("Data successfully added to file (" + rowNumber + " rows)" + account.getCustomerId());
  } 
  spreadSheet.deleteSheet(adwordsSheet); 
  Logger.log("File update complete (" + (mccSheet.getLastRow()-1) + " rows) " + spreadSheet.getUrl());																	

}
