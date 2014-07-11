package demo.adfhtml.view;

import java.util.Map;

import javax.faces.event.ActionEvent;

import oracle.adf.view.rich.render.ClientEvent;


public class TestBean {

    private int nr = 100;

    public void guestMsg(ClientEvent evt) {
        Map<String, Object> params = evt.getParameters();
        System.out.println("Message from guestComponent " + params.get("id") +
                           ": " + params.get("msg"));
    }

    public void setTags(ActionEvent evt) {
        OTNBridge.getInstance().toGuest("tc01", "{tags:" + tags() + "}");
    }

    private String tags() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < nr; i++) {
            if (i > 0) {
                sb.append(",");
            }
            sb.append("{\"id\":\"tag");
            sb.append(i);
            sb.append("\",\"text\":\"Tag ");
            sb.append(i + 1);
            sb.append("\",\"value\":");
            sb.append(50);
            sb.append("}");
        }
        return sb.append("]").toString();
    }

    public void setNr(int nr) {
        this.nr = nr;
    }

    public int getNr() {
        return nr;
    }
}
