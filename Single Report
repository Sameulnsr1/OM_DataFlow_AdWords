function main() {
var ACCOUNT = ['580-299-6951','463-431-6322','494-429-2359','747-414-8801']; // comma delimited, single quoted list of account ids from Adwords (not the account names)
var REPORT_NAME = 'Domo Keyword Report Last 30'; // Change this for each report
var REPORT_TYPE = 'KEYWORDS_PERFORMANCE_REPORT';  //  select the report type from here: https://developers.google.com/adwords/api/docs/appendix/reports?hl=en
var FILTER = 'Impressions > 0'; 
var DATE_RANGE = 'LAST_30_DAYS'; 
var COLUMN_NAMES = [  // select the columns for the report type you chose above.  refer to above URL.  not all columns can go together.  
'ExternalCustomerId',
'AdGroupId',
'AdGroupName',
'Clicks',
'Date',
'DayOfWeek',
'Device',
'Impressions',
'CampaignName',
'VideoViews',
'AllConversionRate',
'AllConversions',
'AllConversionValue',
'Criteria',
'Cost',
'CostPerAllConversion',
'CostPerConversion',
'AccountCurrencyCode',
'AccountDescriptiveName',
'AveragePosition',
'BiddingStrategyName',
'BidType',
'Conversions',
'CrossDeviceConversions',
'KeywordMatchType',
'QualityScore',
'Status',
'ViewThroughConversions',


        ]
var COLUMNS = COLUMN_NAMES.join(',');

Logger.log("Checking for existing file");

if(DriveApp.getFilesByName(REPORT_NAME).hasNext()){
                Logger.log("File found"); 
                var existingReport = DriveApp.getFilesByName(REPORT_NAME).next(); 
                var spreadSheet = SpreadsheetApp.openByUrl(existingReport.getUrl());
} else {
                Logger.log("File not found. Creating new file"); 
                var spreadSheet = SpreadsheetApp.create(REPORT_NAME); 
                Logger.log("New file created");
} 

var mccSheet = spreadSheet.getActiveSheet();
mccSheet.clear(); 
mccSheet.appendRow(COLUMN_NAMES); 
var adwordsSheet = spreadSheet.insertSheet(); 
var accountIterator = MccApp.accounts().withIds(ACCOUNT).get();; 
while (accountIterator.hasNext()) { 
                var account = accountIterator.next();    
        MccApp.select(account); 
        Logger.log("Querying data for " + account.getName()); 
        var REPORT = AdWordsApp.report(
                'SELECT ' + COLUMNS + 
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
