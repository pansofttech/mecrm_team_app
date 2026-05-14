package com.pansofttech.mecrm;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.core.view.WindowCompat;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Enable content to draw behind system bars (status bar and navigation bar)
        // This allows the web app's gradient to show behind the status bar
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
