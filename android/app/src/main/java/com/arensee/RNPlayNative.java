package com.arensee;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import android.os.Vibrator;
import android.content.Context;
import android.widget.Toast;

public class RNPlayNative extends ReactContextBaseJavaModule {
    RNPlayNative(ReactApplicationContext context) {
	super(context);
	ct=context;
    }

    Context ct;

    @Override
    public String getName() {
	return "RNPlayNative";
    }


    private void showToast(String message)
    {    
     Toast toast = Toast.makeText(/*getApplicationContext()*/ ct , message, Toast.LENGTH_SHORT);
     toast.setText(message);    
     toast.show();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)    
    public void runMethod() {
	showToast("Your move...");
    }

}
