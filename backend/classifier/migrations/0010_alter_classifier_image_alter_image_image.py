# Generated by Django 4.0.6 on 2023-11-27 11:06

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classifier', '0009_alter_classifier_result'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classifier',
            name='image',
            field=models.ImageField(storage=django.core.files.storage.FileSystemStorage(), upload_to='images'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.ImageField(storage=django.core.files.storage.FileSystemStorage(), upload_to='images'),
        ),
    ]
