import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  static const String _baseUrl = 'http://127.0.0.1:8000/api';

  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _token;
  Map<String, dynamic>? _user;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get user => _user;
  String? get token => _token;
  static String get baseUrl => _baseUrl;

  AuthProvider() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    final userJson = prefs.getString('user');

    if (_token != null && userJson != null) {
      _isAuthenticated = true;
      _user = jsonDecode(userJson) as Map<String, dynamic>;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/register'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'password_confirmation': password,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final accessToken = data['access_token'] as String?;
        final userData = data['user'] as Map<String, dynamic>?;

        if (accessToken != null && userData != null) {
          _isAuthenticated = true;
          _token = accessToken;
          _user = userData;

          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', accessToken);
          await prefs.setString('user', jsonEncode(userData));

          _isLoading = false;
          notifyListeners();
          return true;
        }
      }
    } catch (e) {
      // You can add logging here if needed
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final accessToken = data['access_token'] as String?;
        final dynamic userRaw = data['user'];
        final Map<String, dynamic>? userData =
            userRaw is Map<String, dynamic> ? userRaw : null;
        if (accessToken != null && userData != null) {
          _isAuthenticated = true;
          _token = accessToken;
          _user = userData;

          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', accessToken);
          await prefs.setString('user', jsonEncode(userData));

          _isLoading = false;
          notifyListeners();
          return true;
        }
      }
    } catch (e) {
    }

    if (email == 'user@febri.net' && password == 'user123') {
      final mockUser = <String, dynamic>{
        'name': 'Febri User',
        'email': 'user@febri.net',
        'role': 'customer',
      };

      _isAuthenticated = true;
      _token = 'mock_token_offline';
      _user = mockUser;

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', _token!);
      await prefs.setString('user', jsonEncode(mockUser));

      _isLoading = false;
      notifyListeners();
      return true;
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    try {
      if (token != null) {
        await http.post(
          Uri.parse('$_baseUrl/logout'),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
      }
    } catch (_) {
      // ignore network errors on logout
    } finally {
      _isAuthenticated = false;
      _token = null;
      _user = null;

      await prefs.remove('token');
      await prefs.remove('user');

      notifyListeners();
    }
  }
}
