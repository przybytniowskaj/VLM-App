# Generated by Django 4.0.6 on 2023-11-27 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classifier', '0012_alter_classifier_image_alter_image_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserCaptionChoices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_path', models.CharField(max_length=255)),
                ('caption', models.TextField()),
            ],
        ),
    ]
