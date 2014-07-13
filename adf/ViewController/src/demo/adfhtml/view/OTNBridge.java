package demo.adfhtml.view;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.apache.myfaces.trinidad.util.ComponentReference;


public class OTNBridge {

    private ComponentReference root;

    public UIComponent getRoot() {
        return root == null ? null : root.getComponent();
    }

    public void setRoot(UIComponent comp) {
        root = ComponentReference.newUIComponentReference(comp);
    }

    public String getInitialiseBridge() {
        ADFHelper.sendJavascript("bootstrapGuestModules('" + getClientId() +
                                 "');");
        return null;
    }

    private String getClientId() {
        return getRoot().getClientId(FacesContext.getCurrentInstance());
    }

    public void toGuest(String guestId, String message) {
        ADFHelper.sendJavascript("sendMessageToGuest('" + getClientId() +
                                 "', '" + guestId + "', " + message + ");");
    }
}
