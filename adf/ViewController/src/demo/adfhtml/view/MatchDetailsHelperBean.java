package demo.adfhtml.view;

import java.util.ArrayList;
import java.util.List;

import oracle.adf.model.binding.DCIteratorBinding;

import oracle.jbo.Row;
import oracle.jbo.ViewObject;

public class MatchDetailsHelperBean {
    public MatchDetailsHelperBean() {
        super();
        

        // get reference to the parent view object via the iterator binding
        DCIteratorBinding iter = ADFHelper.findIterator("MatchResultsView1Iterator");
        Row currentRow = iter.getCurrentRow();
        String scoringProcess = (String)currentRow.getAttribute("ScoringProcess");
//01-10;01|4/3
        boolean firstHalf = false;
        boolean halfTime = false;
        boolean fullTime = false;
        boolean extraTimeOver = false; 
        for (int i= 0; i< scoringProcess.length()-1;i++){
            String event = scoringProcess.substring(i,i+1);
            if (!firstHalf) {
                firstHalf = true;
                matchEvents.add(new MatchEvent("firstHalf","First Half", null));
            }
            if ("-".equals(event)) {
                matchEvents.add(new MatchEvent("halfTime","Half Time Break", null));
                matchEvents.add(new MatchEvent("secondHalf","Second Half", null));
                     halfTime=true;
            }
            if (";".equals(event)) {
              matchEvents.add(new MatchEvent("fullTime","Full Time", null));
              fullTime=true;
            }
            if ("|".equals(event)) {
                matchEvents.add(new MatchEvent("endOfExtra","Extra Time", null));
                if (scoringProcess.length()-1 > i) {
                    extraTimeOver = false; 
                    matchEvents.add(new MatchEvent("wop","Penalty Shootout", scoringProcess.substring(i+1,i+2).equalsIgnoreCase("h")?"home":"away"));
                    
                }
            }
                      
            if ("0".equals(event)) {
            matchEvents.add(new MatchEvent("goal","", "home"));
            }
            if ("1".equals(event)) {
            matchEvents.add(new MatchEvent("goal","", "away"));
            }
            
        }
    }
    
    private List<MatchEvent> matchEvents = new ArrayList<MatchEvent>();
    
    public List<MatchEvent> getMatchEvents() {
        return matchEvents;
    }
    
    public List<Tag> getTags() {
        List<Tag> tags = new ArrayList<Tag>();
        DCIteratorBinding tagiter = ADFHelper.findIterator("MatchTagCloudView1Iterator");
        Row[] rows = tagiter.getAllRowsInRange();  
        
        for (Row row : rows) {  
            tags.add(new Tag((String)row.getAttribute("Tag"), 1, (Boolean)true));            
        } 
        
        return tags;
    }
    public List<String> getPreviouslyAssignedTags() {
        List<String> tags = new ArrayList<String>();
        DCIteratorBinding tagiter = ADFHelper.findIterator("UniqueTagsViewIterator");
        Row[] rows = tagiter.getAllRowsInRange();  
        
        for (Row row : rows) {  
            tags.add((String)row.getAttribute("Tag"));            
        } 
        
        return tags;
    }
}
