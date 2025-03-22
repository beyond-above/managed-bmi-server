
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Info } from 'lucide-react';

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
}

const BmiCalculator = () => {
  const [system, setSystem] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [feet, setFeet] = useState<number | string>('');
  const [inches, setInches] = useState<number | string>('');
  const [pounds, setPounds] = useState<number | string>('');
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const calculateBmi = () => {
    let bmiValue: number;
    
    if (system === 'metric') {
      if (!height || !weight) return;
      
      const heightInMeters = Number(height) / 100;
      bmiValue = Number(weight) / (heightInMeters * heightInMeters);
    } else {
      if (!feet || !inches || !pounds) return;
      
      const heightInInches = (Number(feet) * 12) + Number(inches);
      bmiValue = (Number(pounds) * 703) / (heightInInches * heightInInches);
    }
    
    bmiValue = parseFloat(bmiValue.toFixed(1));
    
    let category: string;
    let color: string;
    
    if (bmiValue < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmiValue < 25) {
      category = 'Normal weight';
      color = 'text-green-500';
    } else if (bmiValue < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else {
      category = 'Obesity';
      color = 'text-red-500';
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setBmiResult({ bmi: bmiValue, category, color });
      setIsAnimating(false);
    }, 300);
  };
  
  const resetCalculator = () => {
    if (system === 'metric') {
      setHeight('');
      setWeight('');
    } else {
      setFeet('');
      setInches('');
      setPounds('');
    }
    setBmiResult(null);
  };
  
  useEffect(() => {
    resetCalculator();
  }, [system]);
  
  return (
    <Card className="w-full max-w-lg glass shadow-subtle">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-medium">BMI Calculator</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowInfo(!showInfo)}
            className="h-8 w-8"
          >
            <Info size={16} />
          </Button>
        </div>
        {showInfo && (
          <CardDescription className="animate-fade-in">
            BMI (Body Mass Index) is a measurement of body fat based on height and weight. 
            It's used to screen for weight categories that may lead to health problems.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="metric" value={system} onValueChange={(value) => setSystem(value as 'metric' | 'imperial')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metric">Metric</TabsTrigger>
            <TabsTrigger value="imperial">Imperial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metric" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height in cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="imperial" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Feet"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Inches"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pounds">Weight (lbs)</Label>
              <Input
                id="pounds"
                type="number"
                placeholder="Enter weight in pounds"
                value={pounds}
                onChange={(e) => setPounds(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {bmiResult && (
          <div className={`mt-6 p-5 rounded-lg border bg-card text-center ${isAnimating ? 'opacity-0' : 'animate-scale-in'}`}>
            <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
            <p className="text-3xl font-semibold">{bmiResult.bmi}</p>
            <p className={`mt-1 font-medium ${bmiResult.color}`}>{bmiResult.category}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetCalculator}
          disabled={
            (system === 'metric' && !height && !weight) || 
            (system === 'imperial' && !feet && !inches && !pounds)
          }
        >
          Reset
        </Button>
        <Button 
          onClick={calculateBmi}
          disabled={
            (system === 'metric' && (!height || !weight)) || 
            (system === 'imperial' && (!feet || !inches || !pounds))
          }
          className="gap-2"
        >
          Calculate <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BmiCalculator;
