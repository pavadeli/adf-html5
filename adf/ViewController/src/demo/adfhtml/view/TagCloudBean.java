package demo.adfhtml.view;

import java.util.ArrayList;
import java.util.List;

import oracle.adf.model.BindingContext;

import oracle.adf.share.logging.ADFLogger;

import oracle.binding.BindingContainer;
import oracle.binding.OperationBinding;

public class TagCloudBean {
    
    private List<Tag> tags = new ArrayList<Tag>();
    private String selectedTags;
    ADFLogger _logger = ADFLogger.createADFLogger(this.getClass());

    
    public TagCloudBean() {
        super();
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
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
