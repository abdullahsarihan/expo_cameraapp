import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from "expo-media-library";

let camera;
export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [zoomLevel, setZoomLevel] = useState(0);

  const handleCapture = async () => {
    if (camera) {
      const options = { quality: 0.7 };
      const data = await camera.takePictureAsync(options);

      await MediaLibrary.saveToLibraryAsync(data.uri);
    }
  };

  const handleZoom = (type) => {
    setZoomLevel((prev) =>
      type === "+"
        ? prev === 100
          ? 100
          : prev + 10
        : prev === 0
        ? 0
        : prev - 10
    );
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        zoom={zoomLevel / 100}
        ref={(ref) => {
          camera = ref;
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>

          <View style={styles.zoomContainer}>
            <TouchableOpacity
              style={styles.zoom}
              onPress={() => handleZoom("-")}
              disabled={zoomLevel / 1000 === 0}
            >
              <Text style={styles.zoomText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.zoom}
              onPress={() => handleZoom("+")}
              disabled={zoomLevel / 100 === 1}
            >
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "#999",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  zoomContainer: {
    flexDirection: "row",
  },
  zoom: {
    width: 40,
    height: 40,
    backgroundColor: "#DDD",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  zoomText: {
    fontSize: 26,
  },
});
