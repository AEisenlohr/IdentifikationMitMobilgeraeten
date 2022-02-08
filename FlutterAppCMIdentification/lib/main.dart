import 'dart:async';
import 'dart:io' show Platform;

import 'package:location_permissions/location_permissions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';
import 'package:binary_codec/binary_codec.dart';

void main() {
  return runApp(
    const MaterialApp(home: HomePage()),
  );
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Column(
          children: [
            const Text('Bachelor_Application_2021',
              textAlign: TextAlign.end,
              style: TextStyle(height: 4, fontSize: 20, fontWeight: FontWeight.bold),
            ),
            OutlinedButton(
                onPressed: _startScan,
                child: const Text('Scan')
            ),
            OutlinedButton(
                onPressed: _connectToDevice,
                child: const Text('Connect')
            ),
            TextFormField(
              controller: usernameController,
              decoration: const InputDecoration(
                labelText: ' Username',
                labelStyle: TextStyle(
                  color: Colors.black,
                ),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.black),
                ),
              ),
            ),
            TextFormField(
              controller: passwordController,
              decoration: const InputDecoration(
                labelText: ' Password',
                labelStyle: TextStyle(
                  color: Colors.black,
                ),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.black),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                const Text('Do you want to register instead?'),
                Checkbox(value: register,
                    onChanged: (newValue) {
                      setState(() {
                        register = newValue!;
                      });
                    }),
                OutlinedButton(
                    onPressed: _sendCredentials,
                    child: const Text('Login')
                )
              ],
            )
          ],
        )
    );
  }

  // Controller for the input
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  bool connected = false;
  bool register = false;

  // Bluetooth variables
  late DiscoveredDevice _peripheralDevice;
  final flutterReactiveBle = FlutterReactiveBle();
  late StreamSubscription<DiscoveredDevice> _scanStream;
  late QualifiedCharacteristic _idrequestCharacteristic;
  late QualifiedCharacteristic _usernameCharacteristic;
  late QualifiedCharacteristic _passwordCharacteristic;

  // These are the UUIDs of your device
  final Uuid serviceUuid = Uuid.parse("13333333333333333333333333333337");
  final Uuid idrequestUuid = Uuid.parse("13333333333333333333333333330001");
  final Uuid usernameUuid = Uuid.parse("13333333333333333333333333330002");
  final Uuid passwordUuid = Uuid.parse("13333333333333333333333333330003");

  //scans for advertising peripheral with known uuid and name
  //called on scan button pressed
  void _startScan() async {
    // Android needs special permission request to use this app
    bool permGranted = false;
    PermissionStatus permission;
    if (Platform.isAndroid) {
      permission = await LocationPermissions().requestPermissions();
      if (permission == PermissionStatus.granted) permGranted = true;
    } else if (Platform.isIOS) {
      permGranted = true;
    }

    // Main scanning logic
    if (permGranted) {
      //send credentials and request to peripheral
      //called on button pressed    _scanStream = flutterReactiveBle
      _scanStream = flutterReactiveBle
          .scanForDevices(withServices: [serviceUuid]).listen((device) {
        if (device.name == 'CommunityMirror') {
          setState(() {
            _peripheralDevice = device;
          });
        }
      });
    }
  }

  //connect to found peripheral and its services and characteristics
  //called on connect button pressed
  void _connectToDevice() {
    _scanStream.cancel();

    Stream<ConnectionStateUpdate> _currentConnectionStream = flutterReactiveBle
        .connectToAdvertisingDevice(
        id: _peripheralDevice.id,
        prescanDuration: const Duration(seconds: 1),
        withServices: [serviceUuid, idrequestUuid, usernameUuid, passwordUuid]);
    _currentConnectionStream.listen((event) {
      switch (event.connectionState) {
        case DeviceConnectionState.connected:
          {
            _idrequestCharacteristic = QualifiedCharacteristic(
                serviceId: serviceUuid,
                characteristicId: idrequestUuid,
                deviceId: event.deviceId);
            _usernameCharacteristic = QualifiedCharacteristic(
                serviceId: serviceUuid,
                characteristicId: usernameUuid,
                deviceId: event.deviceId);
            _passwordCharacteristic = QualifiedCharacteristic(
                serviceId: serviceUuid,
                characteristicId: passwordUuid,
                deviceId: event.deviceId);
            connected = true;
            break;
          }
        case DeviceConnectionState.disconnected:
          {
            break;
          }
        default:
      }
    });
  }

  //send credentials and request to peripheral
  //called on login button pressed
  void _sendCredentials() {
    if (connected) {
      var username = binaryCodec.encode(usernameController.text);
      var password = binaryCodec.encode(passwordController.text);
      var request = 1;
      if (register) {
        request = 2;
      }
      flutterReactiveBle.writeCharacteristicWithResponse(_idrequestCharacteristic, value: [request,]);
      flutterReactiveBle.writeCharacteristicWithResponse(_usernameCharacteristic, value: username);
      flutterReactiveBle.writeCharacteristicWithResponse(_passwordCharacteristic, value: password);
    }
  }
}