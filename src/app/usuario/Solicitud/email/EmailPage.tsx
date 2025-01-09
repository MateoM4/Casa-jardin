import { useState } from "react";
import { sendEmail } from "@/helpers/sendmail";
import { obtenerCodigoConfirmacion } from "@/services/redis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Datos {
  email: string;
  setCorrecto: React.Dispatch<React.SetStateAction<boolean>>;
  correcto: boolean;
  setVerifi: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailPage: React.FC<Datos> = ({ email, setCorrecto, correcto, setVerifi }) => {
  const [codigo, setCodigo] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleEmail = async () => {
    if (email === "") return;
    
    setIsSending(true);
    try {
      const response = await sendEmail(email);
      if (response.ok) {
        setEmailSent(true);
        toast({
          title: "Código enviado",
          description: "Revisa tu bandeja de entrada",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo enviar el código",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el código",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerificarCodigo = async () => {
    if (!codigo) {
      toast({
        title: "Error",
        description: "Por favor ingresa el código",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsVerifying(true);
    setVerifi(true);
    
    try {
      const codigoGuardado = await obtenerCodigoConfirmacion(email);
      if (codigoGuardado === codigo) {
        setCorrecto(true);
        toast({
          title: "¡Verificación exitosa!",
          description: "El código ingresado es correcto",
          duration: 3000,
        });
      } else {
        setCorrecto(false);
        toast({
          title: "Código incorrecto",
          description: "Por favor verifica e intenta nuevamente",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al verificar el código",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-6 w-6" />
            Verificación de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Se enviará un código de verificación a:
            </p>
            <p className="font-medium text-lg">{email}</p>
            <p className="text-sm text-gray-500">
              El código será válido por 5 minutos
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={handleEmail}
              disabled={isSending || emailSent}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : emailSent ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Código Enviado
                </>
              ) : (
                "Enviar Código"
              )}
            </Button>

            {emailSent && (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ingrese el código recibido"
                    className="pr-10"
                    maxLength={6}
                  />
                  {correcto && <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
                  {correcto === false && <XCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />}
                </div>

                <Button 
                  className="w-full"
                  onClick={handleVerificarCodigo}
                  disabled={isVerifying || !codigo}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Código"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailPage;