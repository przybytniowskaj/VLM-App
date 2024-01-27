# VLM-App

In today's rapidly developing technology, the focus is on developing innovative solutions that overcome the limitations of previous implementations. However, what is becoming forgotten is their proper presentation to people unconnected with the development of artificial intelligence and technology. Solutions are created, described in papers and presented at conferences, but only some have dedicated demos and even fewer are used to create free applications and seamlessly support users. Our application stands out by prioritizing user-friendly interaction with advanced Visual-Language models. With an emphasis on visual language modelling, we present a web application that integrates the CLIP model for semantic image retrieval and BLIP for image captioning. The implementation we have created not only makes artificial intelligence more accessible but also promotes continuous improvement of Machine Learning models by saving user suggestions for generated predictions. 

The official paper describing architecture and functionalities is attached in pdf format. 


# Installation Instruction

## Backend
1. Create a virtual environment:
    ```bash
    cd backend
    python -m venv venv
    ```

2. Activate the virtual environment:
    ```bash
    venv\scripts\activate
    ```

3. Install required backend dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

## Frontend
1. Install required frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```

## Model Usage in Our Application
In our application, we utilize the Blip and Clip models. To enable the usage of these models, it is necessary to install the required dependencies. Use the following commands to install the dependencies:
```bash
pip install transformers
pip install openai-clip
pip install clip-anytorch
```
Make sure to run these commands in your Python environment to ensure that the models function correctly within the application.

### File Management with CollectStatic
To use Django's `CollectStatic` for managing static files, run the following command:
```bash
python manage.py collectstatic
```
This command is used to collect all static files from the folders to specified directory.

## Using the Admin Panel
To use the Django Admin Panel, it is needed to create a superuser for your application. Follow these commands to create a superuser:
```bash
python manage.py createsuperuser
```
The above command will allow you to create by entering a username, email address, and password for the superuser account. Once created, you can access the Django Admin Panel at `http://127.0.0.1/admin/` and log in using the superuser credentials.

# Running the Application
To run the application, ensure both the backend and frontend are running.

- From the backend directory, run:
    ```bash
    python manage.py runserver
    ```

- From the frontend directory, run:
    ```bash
    npm run dev
    ```

## Access to Application
The entire application is available at the following address:
```plaintext
http://localhost:3000/
```

**Backend views**  
If users wish to test the functionality of requests and responses, they may explore these URLs. Ensure the backend server is running to interact with these views.

All backend views of the application are accessible at the following base address:
```plaintext
http://127.0.0.1/
```

Additionally, you can access specific views using the following URLs:

- Semantic Image Search: `http://127.0.0.1/api/semanticimagesearch/`
- Classifier: `http://127.0.0.1/api/classifier/`
- User Caption Choices: `http://127.0.0.1/api/auth/user-caption-choices/`
- User Search Choices: `http://127.0.0.1/api/auth/user-search-choices/`
- Get Flickr Images [dataset]: `http://127.0.0.1/api/get_flickr_images/`
- Sign Up: `http://127.0.0.1/auth/signup/`
- Login: `http://127.0.0.1/auth/login/`
- User Profile: `http://127.0.0.1/api/auth/user-profile/`
