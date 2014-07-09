package demo.adfhtml.view;

import java.util.ArrayList;
import java.util.List;

import javax.faces.component.UIComponent;

import oracle.adf.model.BindingContext;

import oracle.adf.share.logging.ADFLogger;

import oracle.adf.view.rich.context.AdfFacesContext;

import oracle.binding.BindingContainer;
import oracle.binding.OperationBinding;

import org.apache.myfaces.trinidad.util.ComponentReference;

public class TagCloudBean {
    
    private List<Tag> tags = new ArrayList<Tag>();
    private String selectedTags;
    ADFLogger _logger = ADFLogger.createADFLogger(this.getClass());


    private ComponentReference tagCloudUIComponent;

    public UIComponent getTagCloudUIComponent(){
       return tagCloudUIComponent == null ?
                null : tagCloudUIComponent.getComponent();
    }

    public void setTagCloudUIComponent(UIComponent tagCloudComponent) {
        tagCloudUIComponent =
            ComponentReference.newUIComponentReference(tagCloudComponent);
    }
    
    public TagCloudBean() {
        super();
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public void setTagsFromEvent(List<Tag> tags) {
        setTags(tags);
        // now refresh the tag cloud
        AdfFacesContext.getCurrentInstance().addPartialTarget(getTagCloudUIComponent());        
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setSelectedTags(String selectedTags) {
        this.selectedTags = selectedTags;
        _logger.warning("Tags have been selected "+selectedTags);
        
        BindingContext bindingContext = BindingContext.getCurrent();
        BindingContainer bindingContainer = bindingContext.getCurrentBindingsEntry();
        OperationBinding binding = bindingContainer.getOperationBinding("publishEvent");
        _logger.warning(" operation binding is found "+binding);
        binding.getParamsMap().put("payload", selectedTags);
        binding.execute();
        _logger.warning("Event has been published");
    }

    public String getSelectedTags() {
        return selectedTags;
    }
}
