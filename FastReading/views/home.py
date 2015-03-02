import json
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from pyPdf import PdfFileWriter, PdfFileReader
from docx import Document


def home(request):
    return render_to_response('home.html')

@csrf_exempt
def test(request):
    texto = ''
    
    if request.FILES.get('fileupload').name.split('.')[1].upper() == 'PDF':
        texto = managePDF(request.FILES.get('fileupload'))
    elif request.FILES.get('fileupload').name.split('.')[1].upper() == 'TXT':
        texto = manageTxt(request.FILES.get('fileupload'))
    elif request.FILES.get('fileupload').name.split('.')[1].upper() == 'DOCX':
        texto = manageDoc(request.FILES.get('fileupload'))

    response = {
        'documento': request.FILES.get('fileupload').name,
        'extension': request.FILES.get('fileupload').name.split('.')[1],
        'texto': texto
    }
    return HttpResponse(json.dumps(response), content_type='application/json')

def managePDF(file_up):
    texto_pdf = ''
    pdf = PdfFileReader(file_up)
    for page in pdf.pages:
        texto_pdf += page.extractText()

    return texto_pdf

def manageTxt(file_up):
    texto_txt = ''
    if file_up.multiple_chunks():
        for chunk in file_up.chunks():
            texto_txt += chunk
    else:
        texto_txt = file_up.read()

    return texto_txt

def manageDoc(file_up):
    document = Document(file_up)
    texto_doc = ''
    for paragrhap in document.paragraphs:
        texto_doc += paragrhap.text

    return texto_doc