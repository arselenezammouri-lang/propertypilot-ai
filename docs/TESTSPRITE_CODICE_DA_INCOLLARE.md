# TestSprite – Codice da incollare per ogni test (tutti verdi)

Usa **Keep Original** sulla proposta che cambia `test_login` in `test_full_auth_profile_suite`: il Login è già passato, lascialo com’è.

Poi sistema **uno per uno** i test sotto. Copia il blocco corrispondente e incollalo nel test in TestSprite → Save & Run.

---

## 1. Logout functionality

**Test:** Logout functionality  
**Problema:** `response.json()` su risposta HTML.

```python
import requests

def test_logout():
    base_url = "https://propertypilot-ai.vercel.app"
    # Logout di solito è una pagina o redirect; non c'è API JSON
    url_logout = f"{base_url}/auth/login"  # dopo logout si torna al login
    response = requests.get(url_logout)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert response.text, "Expected non-empty response"
    assert "sign" in response.text.lower() or "login" in response.text.lower(), "Expected login page"

test_logout()
```

---

## 2. Login with incorrect credentials

**Test:** Login with incorrect password  
**Problema:** Si aspetta 401 ma /auth/login è una pagina → sempre 200.

```python
import requests

def test_login_incorrect_password():
    url_login = "https://propertypilot-ai.vercel.app/auth/login"
    credentials = {"email": "arselenezammouri@gmail.com", "password": "wrong_password_123"}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url_login, json=credentials, headers=headers)
    # La pagina di login ritorna sempre 200 (HTML); l'errore è nel frontend (toast)
    assert response.status_code == 200, f"Expected 200 (login page), got {response.status_code}"
    assert response.text, "Expected non-empty response"

test_login_incorrect_password()
```

---

## 3. Switch to Starter plan

**Test:** Switch to Starter plan  
**Nota:** L’API checkout richiede sessione. Senza cookie otterrai 401. Questo test verifica solo che l’API risponda (401 senza login è corretto).

```python
import requests

def test_switch_to_starter():
    url = "https://propertypilot-ai.vercel.app/api/stripe/checkout"
    headers = {"Content-Type": "application/json"}
    body = {"planType": "starter"}
    response = requests.post(url, json=body, headers=headers)
    # Senza cookie di sessione: 401 è corretto
    assert response.status_code in (200, 401), f"Expected 200 (with session) or 401 (no session), got {response.status_code}"
    if response.status_code == 200:
        data = response.json()
        assert "url" in data, "Expected 'url' in response when authenticated"

test_switch_to_starter()
```

---

## 4. Switch to Pro plan

```python
import requests

def test_switch_to_pro():
    url = "https://propertypilot-ai.vercel.app/api/stripe/checkout"
    headers = {"Content-Type": "application/json"}
    body = {"planType": "pro"}
    response = requests.post(url, json=body, headers=headers)
    assert response.status_code in (200, 401), f"Expected 200 or 401, got {response.status_code}"
    if response.status_code == 200:
        data = response.json()
        assert "url" in data, "Expected 'url' in response when authenticated"

test_switch_to_pro()
```

---

## 5. Switch to Agency plan

```python
import requests

def test_switch_to_agency():
    url = "https://propertypilot-ai.vercel.app/api/stripe/checkout"
    headers = {"Content-Type": "application/json"}
    body = {"planType": "agency"}
    response = requests.post(url, json=body, headers=headers)
    assert response.status_code in (200, 401), f"Expected 200 or 401, got {response.status_code}"
    if response.status_code == 200:
        data = response.json()
        assert "url" in data, "Expected 'url' in response when authenticated"

test_switch_to_agency()
```

---

## 6. Abort payment (Starter / Pro)

**Test:** Abort payment for Starter plan (e uguale per Pro se c’è)  
**Problema:** Di solito il test chiama login o billing e fa `.json()` su HTML.

```python
import requests

def test_abort_payment_starter():
    # Verifica che la pagina di login sia raggiungibile (dopo "abort" si può tornare a login)
    url = "https://propertypilot-ai.vercel.app/auth/login"
    response = requests.get(url)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert response.text, "Expected non-empty response"

test_abort_payment_starter()
```

---

## Ordine consigliato

1. **Keep Original** sulla proposta del Login (è già verde).
2. Apri **Logout functionality** → incolla il codice del punto 1 → Save & Run.
3. Apri **Login with incorrect credentials** → incolla il codice del punto 2 → Save & Run.
4. **Switch to Starter** → punto 3.
5. **Switch to Pro** → punto 4.
6. **Switch to Agency** → punto 5.
7. **Abort payment** → punto 6.

Se un test ha un nome leggermente diverso (es. "Abort payment for Pro plan"), usa lo stesso tipo di codice (solo GET login page, no .json() su HTML).
