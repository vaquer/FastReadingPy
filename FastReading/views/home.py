import json
import os
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import UploadedFile
from django.core.files import File
from django.conf import settings
from pyPdf import PdfFileWriter, PdfFileReader
from docx import Document


def home(request):
    return render_to_response('home.html', {'files_recently_open': get_list_files()})

@csrf_exempt
def test(request):
    texto = get_text_file(request.FILES.get('fileupload'))
    save_file(request.FILES.get('fileupload'))

    response = {
        'documento': request.FILES.get('fileupload').name,
        'extension': request.FILES.get('fileupload').name.split('.')[1],
        'texto': texto,
        'files_recently_open': get_list_files()
    }
    return HttpResponse(json.dumps(response), content_type='application/json')

@csrf_exempt
def view_get_text_file(request):
    response = {}
    if request.method == "POST":
        with open(os.path.join(settings.UPLOAD_FILES, request.POST.get('file')), "r+") as content_file:
            file_to_read = File(content_file)

            response = {
                'texto': get_text_file(file_to_read, request.POST.get('file')),
                # 'texto': open(os.path.join(settings.UPLOAD_FILES, request.POST.get('file')), "r+").read(),
                'documento': file_to_read.name,
                'extension': file_to_read.name.split('.')[1],
                'size': file_to_read.size,
                'files_recently_open': get_list_files()
            }

    return HttpResponse(json.dumps(response), content_type="application/json")

def get_text_file(file_to_read, name=None):
    texto = ''
    
    if file_to_read.name.split('.')[1].upper() == 'PDF':
        texto = manage_PDF(file_to_read)
    elif file_to_read.name.split('.')[1].upper() == 'TXT':
        texto = manage_Txt(file_to_read)
    elif file_to_read.name.split('.')[1].upper() == 'DOCX':
        texto = manage_Doc(file_to_read)
        # texto = manage_Doc(file_to_read if name == None else os.path.join(settings.UPLOAD_FILES, name))

    return texto

def save_file(file_upload):
    clen_dir()
    file_to_save = open(os.path.join(settings.UPLOAD_FILES, file_upload.name), "wb+")
    file_upload.seek(0)
    if file_upload.multiple_chunks():
        for chunk in file_upload,chunks():
            file_to_save.write(chunk)
    else:
        file_to_save.write(file_upload.read())
    file_to_save.close()

def clen_dir():
    files_saved = os.listdir(settings.UPLOAD_FILES)
    if len(files_saved) > 9:
        os.remove(os.path.join(settings.UPLOAD_FILES, files_saved[9]))

def get_list_files():
    return os.listdir(settings.UPLOAD_FILES)

def manage_PDF(file_up):
    texto_pdf = ''
    pdf = PdfFileReader(file_up)
    for page in pdf.pages:
        texto_pdf += page.extractText()

    return texto_pdf

def manage_Txt(file_up):
    texto_txt = ''
    if file_up.multiple_chunks():
        for chunk in file_up.chunks():
            texto_txt += chunk
    else:
        texto_txt = file_up.read()

    return texto_txt

def manage_Doc(file_up):
    document = Document(file_up)
    texto_doc = ''
    for paragrhap in document.paragraphs:
        texto_doc += paragrhap.text

    return texto_doc