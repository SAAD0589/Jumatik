package ma.jumatik.android;

import android.app.Application;
import android.os.Bundle;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize the Facebook SDK
        FacebookSdk.sdkInitialize(getApplicationContext());

        AppEventsLogger.activateApp(getApplication(), "599879425305048");


        // Rest of your code
    }
}
