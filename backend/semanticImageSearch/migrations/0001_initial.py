# Generated by Django 4.0.6 on 2023-11-18 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SemanticImageSearch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images')),
                ('date_uploaded', models.DateTimeField(auto_now_add=True)),
                ('phrase', models.CharField(max_length=250)),
            ],
        ),
    ]