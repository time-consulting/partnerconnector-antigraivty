export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-how-it-works-title">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple 3-step process to start earning commissions from your professional network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center" data-testid="step-upload">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary-foreground">1</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Upload & Submit</h3>
            <p className="text-muted-foreground mb-6">
              Upload your client's current payment processing bills and submit their business details through our secure portal.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Professional uploading documents" 
              className="rounded-lg shadow-md w-full h-48 object-cover"
              data-testid="img-step-1"
            />
          </div>

          {/* Step 2 */}
          <div className="text-center" data-testid="step-quote">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-accent-foreground">2</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Get Competitive Quote</h3>
            <p className="text-muted-foreground mb-6">
              We analyze their current setup and provide a detailed comparison quote showing potential savings and improved features.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Analyzing financial data" 
              className="rounded-lg shadow-md w-full h-48 object-cover"
              data-testid="img-step-2"
            />
          </div>

          {/* Step 3 */}
          <div className="text-center" data-testid="step-commission">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Earn Commission</h3>
            <p className="text-muted-foreground mb-6">
              Once your client switches, earn 70% of the deal value as upfront commission plus ongoing bonuses for successful deals.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Financial success celebration" 
              className="rounded-lg shadow-md w-full h-48 object-cover"
              data-testid="img-step-3"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white border-2 border-primary rounded-xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Start Earning?</h3>
            <p className="text-xl text-foreground mb-8">
              Join hundreds of professionals already earning substantial commissions
            </p>
            <button 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg border-2 border-primary"
              onClick={() => window.location.href = "/login"}
              data-testid="button-create-account"
            >
              Create Your Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
