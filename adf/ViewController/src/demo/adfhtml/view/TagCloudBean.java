package demo.adfhtml.view;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.faces.component.UIComponent;

import javax.faces.event.ActionEvent;

import oracle.adf.model.BindingContext;
import oracle.adf.share.logging.ADFLogger;
import oracle.adf.view.rich.context.AdfFacesContext;
import oracle.adf.view.rich.render.ClientEvent;
import oracle.adf.view.rich.util.ResetUtils;

import oracle.binding.BindingContainer;
import oracle.binding.OperationBinding;

import org.apache.myfaces.trinidad.util.ComponentReference;


public class TagCloudBean {

    private static final ADFLogger _logger =
        ADFLogger.createADFLogger(TagCloudBean.class);

    private List<Tag> tags = new ArrayList<Tag>();
    // a list of all tags that have been assigned manually; these can be used to offer
    // the user options to choose from in a compbo box where new tags can be specified as well
    private List<String> previouslyAssignedTags = new ArrayList<String>();
    
    private String newTag;
    
    //indicates whether new tags can be added to the cloud/existing (manual) tags can be removed
    private Boolean editable=false;
    
    private String selectedTags;

    private OTNBridge otnBridge;

    private ComponentReference tagCloudUIComponent;

    public void setTagsFromEvent(List<Tag> tags) {
        setTags(tags);
        // now refresh the tag cloud
        AdfFacesContext.getCurrentInstance().addPartialTarget(getTagCloudUIComponent().findComponent("it1"));
        updateTags();
    }

    public void tagcloudEvent(ClientEvent evt) {
        ResetUtils.reset(getTagCloudUIComponent());

        Map<String, Object> params = evt.getParameters();
        _logger.log("Received message from " + params.get("id"));
        Map<String, String> msg = (Map<String, String>)params.get("msg");
        String tagId = msg.get("clicked");
        _logger.log("Clicked tag: " + tagId);

        String tags = getSelectedTags();
        if (tags != null && !tags.isEmpty()) {
            tags += "," + tagId;
        } else {
            tags = tagId;
        }
        setSelectedTags(tags);
    }

    public String getInitialise() {
        getOtnBridge().getInitialiseBridge();
        updateTags();
        return null;
    }

    private void updateTags() {
        StringBuilder sb = new StringBuilder("{tags:[");
        for (Tag tag : getTags()) {
            if (sb.length() > 7) {
                sb.append(",");
            }
            sb.append("{\"id\":\"");
            sb.append(tag.getTag());
            sb.append("\",\"text\":\"");
            sb.append(tag.getTag()).append(" (").append(tag.getOccurrences()).append(")");
            sb.append("\",\"value\":");
            sb.append(tag.getOccurrences() + 10);
            sb.append("}");
        }
        sb.append("]}");
        getOtnBridge().toGuest("tc1", sb.toString());
    }

    public UIComponent getTagCloudUIComponent() {
        return tagCloudUIComponent == null ? null :
               tagCloudUIComponent.getComponent();
    }

    public void setTagCloudUIComponent(UIComponent tagCloudComponent) {
        tagCloudUIComponent =
                ComponentReference.newUIComponentReference(tagCloudComponent);
        getOtnBridge().setRoot(tagCloudComponent);
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setSelectedTags(String selectedTags) {
        this.selectedTags = selectedTags;

        _logger.warning("Tags have been selected " + selectedTags);

        BindingContext bindingContext = BindingContext.getCurrent();
        BindingContainer bindingContainer =
            bindingContext.getCurrentBindingsEntry();
        OperationBinding binding =
            bindingContainer.getOperationBinding("publishEvent");
        _logger.warning(" operation binding is found " + binding);
        binding.getParamsMap().put("payload", selectedTags);
        binding.execute();
        _logger.warning("Event has been published");
    }

    public void addTag(ActionEvent ae) {
        // do your thing to add the tag set in the newTag property
        getPreviouslyAssignedTags().add(getNewTag());
        // publish event about new tag
        
        _logger.warning("Event must be published for new tag "+getNewTag());
    }

    public String getSelectedTags() {
        return selectedTags;
    }

    public void setOtnBridge(OTNBridge otnBridge) {
        this.otnBridge = otnBridge;
    }

    public OTNBridge getOtnBridge() {
        return otnBridge;
    }

    public void setPreviouslyAssignedTags(List<String> previouslyAssignedTags) {
        this.previouslyAssignedTags = previouslyAssignedTags;
    }

    public List<String> getPreviouslyAssignedTags() {
        return previouslyAssignedTags;
    }

    public String getPreviouslyAssignedTagsAsString() {
        String tags="";
        if (getPreviouslyAssignedTags()!=null) {
        for (String tag:getPreviouslyAssignedTags()) {
            tags= tags+", "+tag;
        }
        }
        return tags.substring(2);
    }

    public void setEditable(Boolean editable) {
        this.editable = editable;
    }

    public Boolean getEditable() {
        return editable;
    }

    public void setNewTag(String newTag) {
        this.newTag = newTag;
    }

    public String getNewTag() {
        return newTag;
    }
}
