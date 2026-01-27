package com.example.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends BridgeActivity {
@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Disable default system fitting (fixes Android 15 edge-to-edge issue)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Apply safe-area insets so Angular content doesn’t overlap status/nav bars
        ViewCompat.setOnApplyWindowInsetsListener(
            findViewById(android.R.id.content),
            (view, insets) -> {
                Insets sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                view.setPadding(
                    sysBars.left,
                    sysBars.top,
                    sysBars.right,
                    sysBars.bottom
                );
                return WindowInsetsCompat.CONSUMED;
            }
        );
    }
}
