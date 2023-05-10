package com.marocapps.jumatik.sellandbuy;

import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

import com.getcapacitor.Bridge;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        this.registerPlugin(GoogleAuth.class);

        super.onCreate(savedInstanceState);

        // Initializes the Capacitor GoogleAuth plugin

        // Initialize the Facebook SDK
        FacebookSdk.sdkInitialize(getApplicationContext());

        AppEventsLogger.activateApp(getApplication(), "411663800863137");

        // Rest of your code
    }



}
