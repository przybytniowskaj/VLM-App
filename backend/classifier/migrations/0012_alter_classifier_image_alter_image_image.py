# Generated by Django 4.0.6 on 2023-11-27 11:35

import classifier.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classifier', '0011_alter_classifier_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classifier',
            name='image',
            field=models.ImageField(storage=classifier.models.OverwriteStorage(), upload_to='images'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.ImageField(storage=classifier.models.OverwriteStorage(), upload_to='images'),
        ),
    ]
