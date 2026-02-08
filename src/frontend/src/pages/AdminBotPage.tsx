import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActor } from '@/hooks/useActor';
import { normalizeIcError } from '@/utils/icErrorNormalization';

export default function AdminBotPage() {
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { actor } = useActor();

  const handleSubmit = async () => {
    if (!actor) {
      setErrorMessage('Backend not available');
      return;
    }

    if (!instruction.trim()) {
      setErrorMessage('Please enter an instruction');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await actor.submitAdminBotInstruction(instruction);
      setSuccessMessage(result);
      setInstruction(''); // Clear textarea on success
    } catch (error: any) {
      const normalized = normalizeIcError(error);
      setErrorMessage(normalized.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/40 backdrop-blur-sm border-pearl-blue/20">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-pearl-off-white">
            Admin Bot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="instruction" className="text-pearl-off-white">
              Instruction
            </Label>
            <Textarea
              id="instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Enter your instruction here..."
              rows={8}
              className="bg-black/60 border-pearl-blue/30 text-pearl-off-white placeholder:text-pearl-off-white/40 focus:border-gold/50 focus:ring-gold/20 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {successMessage && (
            <div className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {errorMessage}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !instruction.trim()}
            className="w-full bg-pearl-blue hover:bg-pearl-blue/80 text-white font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
